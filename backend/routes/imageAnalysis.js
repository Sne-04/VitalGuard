const express = require('express');
const router = express.Router();
const ImageAnalysis = require('../models/ImageAnalysis');
const { protect } = require('../middleware/auth');

// @route   POST /api/image-analysis
// @desc    Save image analysis result
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { imageThumbnail, originalFileName, condition, severity, relatedConditions, recommendations, bodyPart } = req.body;

        if (!condition || !condition.name) {
            return res.status(400).json({ success: false, message: 'Condition name is required' });
        }

        const analysis = await ImageAnalysis.create({
            user: req.user.id,
            imageThumbnail: imageThumbnail || null,
            originalFileName: originalFileName || 'unknown',
            condition,
            severity: severity || { level: 'Mild', confidence: 70 },
            relatedConditions: relatedConditions || [],
            recommendations: recommendations || [],
            bodyPart: bodyPart || 'Unknown'
        });

        res.status(201).json({ success: true, data: analysis });
    } catch (error) {
        console.error('Image analysis save error:', error);
        res.status(500).json({ success: false, message: 'Error saving analysis', error: error.message });
    }
});

// @route   GET /api/image-analysis/history
// @desc    Get image analysis history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const analyses = await ImageAnalysis.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('-imageThumbnail'); // exclude large base64 data from list

        res.status(200).json({ success: true, data: analyses, count: analyses.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching history', error: error.message });
    }
});

// @route   GET /api/image-analysis/:id
// @desc    Get single analysis with image
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const analysis = await ImageAnalysis.findOne({ _id: req.params.id, user: req.user.id });
        if (!analysis) {
            return res.status(404).json({ success: false, message: 'Analysis not found' });
        }
        res.status(200).json({ success: true, data: analysis });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching analysis', error: error.message });
    }
});

module.exports = router;
