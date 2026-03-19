const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
// Some versions/environments require .default
const parsePDF = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;
const Anthropic = require('@anthropic-ai/sdk');
const { protect } = require('../middleware/auth');
const LabReport = require('../models/LabReport');

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/analyze', protect, upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const pdfData = await parsePDF(req.file.buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'This appears to be a scanned PDF or contains no extractable text. Text extraction failed. Please upload a digital PDF.' 
      });
    }

    const systemPrompt = `You are a medical lab report analyzer. The user has uploaded a lab report.
Extract ALL test values and return ONLY a valid JSON object.
No preamble, no markdown, no explanation outside the JSON.

Return this exact structure:
{
  "patient": {
    "name": "string or null",
    "date": "string or null",
    "lab": "string or null"
  },
  "summary": {
    "total": number,
    "normal": number,
    "borderline": number,
    "abnormal": number
  },
  "results": [
    {
      "test": "Test name",
      "value": "e.g. 11.2",
      "unit": "e.g. g/dL",
      "normalRange": "e.g. 12.0 - 17.5",
      "status": "normal" | "borderline" | "abnormal",
      "plainEnglish": "One sentence explanation a non-doctor can understand",
      "detail": "2-3 sentence deeper explanation of what this means for health",
      "concern": "What symptom or condition this could relate to (or null)"
    }
  ],
  "doctorQuestions": [
    "Question 1 to ask doctor",
    "Question 2 to ask doctor",
    "Question 3 to ask doctor"
  ],
  "overallInsight": "2-3 sentence plain English summary of the overall report"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        { role: 'user', content: `Lab Report Text:\n${extractedText}` }
      ],
    });

    const rawText = message.content[0].text;
    
    // Clean JSON response
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleanJson);

    if (!analysis.results || analysis.results.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No lab values detected. Please ensure this is a blood/lab report.' 
      });
    }

    const report = await LabReport.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      reportDate: analysis.patient?.date || new Date().toISOString(),
      analysis
    });

    res.json({ success: true, report });
  } catch (err) {
    console.error('Lab Analysis Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/history', protect, async (req, res) => {
  try {
    const reports = await LabReport.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
