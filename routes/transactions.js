// routes/transactions.js - Transaction CRUD routes
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions for logged-in user
router.get('/', async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.user.id });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a transaction
router.post('/', async (req, res) => {
  try {
    const { desc, amount, type, category, date } = req.body;
    const tx = new Transaction({
      userId: req.user.id,
      desc,
      amount,
      type,
      category,
      date,
    });
    await tx.save();
    res.json(tx);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

module.exports = router; 