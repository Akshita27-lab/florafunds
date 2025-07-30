// routes/reports.js - Reports and summary data
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get summary report for logged-in user
router.get('/', async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.user.id });
    let income = 0, expense = 0;
    const catMap = {};
    const monthMap = {};
    txs.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
      // Category-wise
      if (t.type === 'expense') catMap[t.category] = (catMap[t.category]||0) + t.amount;
      // Monthly trend
      const m = t.date.slice(0,7); // YYYY-MM
      if (!monthMap[m]) monthMap[m] = { income:0, expense:0 };
      monthMap[m][t.type] += t.amount;
    });
    res.json({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      categoryExpense: catMap,
      monthlyTrend: monthMap,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 