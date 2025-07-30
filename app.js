// --- Theme Toggle ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
};
// Set theme on load
if (localStorage.getItem('theme') === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}

// --- Navigation ---
const sections = {
  auth: document.getElementById('auth-section'),
  dashboard: document.getElementById('dashboard-section'),
  transactions: document.getElementById('transactions-section'),
  reports: document.getElementById('reports-section'),
};
function showSection(name) {
  Object.entries(sections).forEach(([key, sec]) => {
    if (key === name) {
      sec.classList.remove('hidden');
      sec.classList.add('fade-section');
    } else {
      sec.classList.add('hidden');
      sec.classList.remove('fade-section');
    }
  });
  // Highlight nav
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  if (name !== 'auth') {
    const navBtn = document.getElementById('nav-' + name);
    if (navBtn) navBtn.classList.add('active');
  }
}
// Nav button events
if (document.getElementById('nav-dashboard'))
  document.getElementById('nav-dashboard').onclick = () => showSection('dashboard');
if (document.getElementById('nav-transactions'))
  document.getElementById('nav-transactions').onclick = () => showSection('transactions');
if (document.getElementById('nav-reports'))
  document.getElementById('nav-reports').onclick = () => { renderCharts(); showSection('reports'); };
if (document.getElementById('logout-btn'))
  document.getElementById('logout-btn').onclick = () => { localStorage.removeItem('finora-user'); showSection('auth'); };

// --- Toast Notification ---
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.background = isError ? 'var(--expense)' : 'var(--accent-gradient)';
  toast.classList.remove('hidden');
  toast.style.transform = 'translateX(-50%) scale(1)';
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) scale(0.95)';
    toast.classList.add('hidden');
  }, 2500);
}

// --- Floating Label Support ---
// For all input fields, trigger label float on input
function updateFloatingLabels() {
  document.querySelectorAll('.input-group input, .input-group select').forEach(input => {
    input.addEventListener('input', function() {
      if (this.value) {
        this.classList.add('has-value');
      } else {
        this.classList.remove('has-value');
      }
    });
    // Initial state
    if (input.value) input.classList.add('has-value');
  });
}
updateFloatingLabels();

// --- Auth Logic (localStorage for demo) ---
const authForm = document.getElementById('auth-form');
authForm.onsubmit = e => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) {
    showToast('Username and password required', true);
    return;
  }
  // Save user in localStorage (demo only)
  localStorage.setItem('finora-user', JSON.stringify({ username }));
  showSection('dashboard');
  showToast('Login successful!');
  renderSummary();
  renderTransactions();
};
if (localStorage.getItem('finora-user')) {
  showSection('dashboard');
  renderSummary();
  renderTransactions();
}

// --- Transactions Logic ---
function getTransactions() {
  return JSON.parse(localStorage.getItem('finora-transactions') || '[]');
}
function setTransactions(arr) {
  localStorage.setItem('finora-transactions', JSON.stringify(arr));
}
function renderSummary() {
  const txs = getTransactions();
  let income = 0, expense = 0;
  txs.forEach(t => {
    if (t.type === 'income') income += Number(t.amount);
    else expense += Number(t.amount);
  });
  document.getElementById('total-income').textContent = '₹' + income;
  document.getElementById('total-expense').textContent = '₹' + expense;
  document.getElementById('balance').textContent = '₹' + (income - expense);
}
function renderTransactions() {
  const tbody = document.querySelector('#transactions-table tbody');
  tbody.innerHTML = '';
  getTransactions().forEach((t, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.desc}</td>
      <td style="color:${t.type==='income'?'var(--income)':'var(--expense)'}">₹${t.amount}</td>
      <td>${t.type}</td>
      <td>${t.category}</td>
      <td>${t.date}</td>
      <td>
        <button onclick="editTransaction(${i})">Edit</button>
        <button onclick="deleteTransaction(${i})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
window.editTransaction = function(idx) {
  const txs = getTransactions();
  const t = txs[idx];
  document.getElementById('trans-desc').value = t.desc;
  document.getElementById('trans-amount').value = t.amount;
  document.getElementById('trans-type').value = t.type;
  document.getElementById('trans-category').value = t.category;
  document.getElementById('trans-date').value = t.date;
  deleteTransaction(idx, false);
};
window.deleteTransaction = function(idx, showMsg = true) {
  const txs = getTransactions();
  txs.splice(idx, 1);
  setTransactions(txs);
  renderSummary();
  renderTransactions();
  if (showMsg) showToast('Transaction deleted');
};
const txForm = document.getElementById('transaction-form');
txForm.onsubmit = e => {
  e.preventDefault();
  const desc = document.getElementById('trans-desc').value.trim();
  const amount = document.getElementById('trans-amount').value;
  const type = document.getElementById('trans-type').value;
  const category = document.getElementById('trans-category').value.trim();
  const date = document.getElementById('trans-date').value;
  if (!desc || !amount || !category || !date) {
    showToast('All fields required', true);
    return;
  }
  const txs = getTransactions();
  txs.push({ desc, amount, type, category, date });
  setTransactions(txs);
  renderSummary();
  renderTransactions();
  txForm.reset();
  showToast('Transaction added!');
};

// --- Reports/Charts ---
let pieChart, lineChart;
function renderCharts() {
  const txs = getTransactions();
  // Pie chart: category-wise expense
  const catMap = {};
  txs.filter(t=>t.type==='expense').forEach(t => {
    catMap[t.category] = (catMap[t.category]||0) + Number(t.amount);
  });
  const pieCtx = document.getElementById('pie-chart').getContext('2d');
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(catMap),
      datasets: [{
        data: Object.values(catMap),
        backgroundColor: ['#e74c3c','#f1c40f','#8e44ad','#3498db','#2ecc71','#e67e22'],
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
  // Line chart: monthly trend
  const monthMap = {};
  txs.forEach(t => {
    const m = t.date.slice(0,7); // YYYY-MM
    if (!monthMap[m]) monthMap[m] = { income:0, expense:0 };
    monthMap[m][t.type] += Number(t.amount);
  });
  const months = Object.keys(monthMap).sort();
  const lineCtx = document.getElementById('line-chart').getContext('2d');
  if (lineChart) lineChart.destroy();
  lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'Income', data: months.map(m=>monthMap[m].income), borderColor: 'var(--income)', fill: false },
        { label: 'Expense', data: months.map(m=>monthMap[m].expense), borderColor: 'var(--expense)', fill: false },
      ]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
}
// Export CSV
function exportCSV() {
  const txs = getTransactions();
  let csv = 'Description,Amount (INR),Type,Category,Date\n';
  txs.forEach(t => {
    csv += `${t.desc},₹${t.amount},${t.type},${t.category},${t.date}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'finora-transactions.csv';
  a.click();
}
document.getElementById('export-csv').onclick = exportCSV;
// --- End of app.js --- 