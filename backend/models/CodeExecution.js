const mongoose = require('mongoose');

const codeExecutionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['C', 'C++', 'Java', 'Python']
  },
  code: {
    type: String,
    required: true
  },
  output: String,
  executionTime: Number,
  success: Boolean,
  error: String
}, {
  timestamps: true
});

module.exports = mongoose.model('CodeExecution', codeExecutionSchema);