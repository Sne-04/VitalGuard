const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');

// @route   GET /api/analytics/overview
// @desc    Get overall analytics summary
// @access  Public
router.get('/overview', async (req, res) => {
    try {
        const totalPredictions = await Prediction.countDocuments();

        const severityDist = await Prediction.aggregate([
            { $group: { _id: '$severity.level', count: { $sum: 1 } } }
        ]);

        const topDiseases = await Prediction.aggregate([
            { $group: { _id: '$disease.name', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recentCount = await Prediction.countDocuments({ createdAt: { $gte: last30Days } });

        res.status(200).json({
            success: true,
            data: {
                totalPredictions,
                recentPredictions: recentCount,
                severityDistribution: severityDist,
                topDiseases,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Analytics overview error:', error);
        res.status(500).json({ success: false, message: 'Error fetching analytics', error: error.message });
    }
});

// @route   GET /api/analytics/trends
// @desc    Get symptom and disease trends by date range
// @access  Public
router.get('/trends', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Daily prediction counts
        const dailyTrends = await Prediction.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top symptoms
        const topSymptoms = await Prediction.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: '$symptoms' },
            { $group: { _id: '$symptoms', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Disease distribution
        const diseaseDistribution = await Prediction.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: '$disease.name', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                dailyTrends,
                topSymptoms,
                diseaseDistribution,
                dateRange: { start: startDate, end: new Date(), days }
            }
        });
    } catch (error) {
        console.error('Analytics trends error:', error);
        res.status(500).json({ success: false, message: 'Error fetching trends', error: error.message });
    }
});

// @route   GET /api/analytics/severity-distribution
// @desc    Get severity level distribution
// @access  Public
router.get('/severity-distribution', async (req, res) => {
    try {
        const distribution = await Prediction.aggregate([
            {
                $group: {
                    _id: '$severity.level',
                    count: { $sum: 1 },
                    avgConfidence: { $avg: '$severity.confidence' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const triageDist = await Prediction.aggregate([
            {
                $group: {
                    _id: '$triage.level',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                severityDistribution: distribution,
                triageDistribution: triageDist
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching distribution', error: error.message });
    }
});

module.exports = router;
