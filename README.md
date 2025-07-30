# Florafunds (Spendly) - Personal Finance Tracker

Florafunds (also known as Spendly) is a full-stack personal finance tracker that helps users manage their income, expenses, and financial reports with a modern, responsive interface. It features secure authentication, transaction management, insightful reports, and a beautiful UI with dark mode support.

---

## 🚀 Live Demo

[Try Florafunds Live](https://florafundss.netlify.app/)

---

## 📸 Screenshots


- **Login Page:**  
  ![Login Page](screenshots/login.png)
- **Dashboard:**  
  ![Dashboard](screenshots/dashboard.png)
- **Transactions:**  
  ![Transactions](screenshots/transactions.png)
- **Reports:**  
  ![Reports](screenshots/reports.png)

---

## ✨ Features

- **User Authentication:** Register and login securely (JWT-based, passwords hashed).
- **Dashboard:** View total income, expenses, and balance at a glance.
- **Transactions:** Add, edit, and delete income/expense transactions with categories and dates.
- **Reports:** Visualize your spending with category-wise pie charts and monthly trend line charts.
- **Export:** Download your transactions as a CSV file.
- **Dark/Light Mode:** Toggle between light and dark themes.
- **Responsive UI:** Works well on desktop and mobile browsers.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla), Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Other:** CORS, dotenv

---

## ⚡ Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd spendly
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:
   ```
   MONGO_URI=mongodb://localhost:27017/finora
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Start the backend server:**
   ```bash
   node server.js
   ```
   The server will run on `http://localhost:5000`.

5. **Open the frontend:**
   - Open `index.html` directly in your browser for demo (localStorage mode).
   - For full-stack usage, serve the frontend via a static server or integrate with the backend.

---

## 🚦 Usage

- **Register/Login:** Create an account or log in to access your dashboard.
- **Add Transactions:** Enter your income or expenses with description, amount, type, category, and date.
- **View Dashboard:** See your total income, expenses, and balance.
- **Analyze Reports:** Check category-wise and monthly trends in the Reports section.
- **Export Data:** Download your transactions as a CSV file for offline use.
- **Switch Theme:** Use the theme toggle for dark or light mode.

---

## 📚 License

This project is licensed under the MIT License.

---

**Live Demo:** [https://florafundss.netlify.app/](https://florafundss.netlify.app/)