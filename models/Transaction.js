// models/Transaction.js - Mongoose model for transactions
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  desc: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
});

module.exports = mongoose.model('Transaction', TransactionSchema); 