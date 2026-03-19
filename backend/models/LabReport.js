const mongoose = require('mongoose');

const LabReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String },
  reportDate: { type: String },
  analysis: {
    patient: {
      name: String,
      date: String,
      lab: String
    },
    summary: {
      total: Number,
      normal: Number,
      borderline: Number,
      abnormal: Number
    },
    results: [
      {
        test: String,
        value: String,
        unit: String,
        normalRange: String,
        status: String,
        plainEnglish: String,
        detail: String,
        concern: String
      }
    ],
    doctorQuestions: [String],
    overallInsight: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LabReport', LabReportSchema);
