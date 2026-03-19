const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Vitals = require('../models/Vitals');
const { protect } = require('../middleware/auth');

// @route   POST /api/vitals
// @desc    Save vitals reading
// @access  Private
router.post('/', protect, [
    body('heartRate').isFloat({ min: 30, max: 250 }).withMessage('Heart rate must be between 30-250 BPM'),
    body('spo2').isFloat({ min: 50, max: 100 }).withMessage('SpO2 must be between 50-100%'),
    body('temperature').isFloat({ min: 90, max: 110 }).withMessage('Temperature must be between 90-110°F')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { heartRate, spo2, temperature, bloodPressure, steps, device } = req.body;

        // Determine status
        let status = 'normal';
        if (heartRate > 120 || heartRate < 50 || spo2 < 90 || temperature > 103) {
            status = 'critical';
        } else if (heartRate > 100 || heartRate < 60 || spo2 < 95 || temperature > 100.4) {
            status = 'warning';
        }

        const vitals = await Vitals.create({
            user: req.user.id,
            heartRate,
            spo2,
            temperature,
            bloodPressure: bloodPressure || { systolic: 120, diastolic: 80 },
            steps: steps || 0,
            device: device || 'generic_sensor',
            status
        });

        res.status(201).json({ success: true, data: vitals });
    } catch (error) {
        console.error('Vitals save error:', error);
        res.status(500).json({ success: false, message: 'Error saving vitals', error: error.message });
    }
});

// @route   GET /api/vitals/latest
// @desc    Get latest vitals for user
// @access  Private
router.get('/latest', protect, async (req, res) => {
    try {
        const vitals = await Vitals.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: vitals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching vitals', error: error.message });
    }
});

// @route   GET /api/vitals/history
// @desc    Get vitals history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const vitals = await Vitals.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(limit);

        res.status(200).json({ success: true, data: vitals, count: vitals.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching vitals history', error: error.message });
    }
});

module.exports = router;
