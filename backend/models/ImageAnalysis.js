const mongoose = require('mongoose');

const imageAnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageThumbnail: {
        type: String // base64 encoded small thumbnail
    },
    originalFileName: {
        type: String
    },
    condition: {
        name: { type: String, required: true },
        confidence: { type: Number, required: true },
        category: { type: String }
    },
    severity: {
        level: {
            type: String,
            enum: ['Mild', 'Moderate', 'Severe'],
            required: true
        },
        confidence: { type: Number }
    },
    relatedConditions: [{
        name: String,
        probability: Number
    }],
    recommendations: [String],
    bodyPart: {
        type: String,
        default: 'Unknown'
    }
}, {
    timestamps: true
});

imageAnalysisSchema.index({ user: 1, createdAt: -1 });
imageAnalysisSchema.index({ 'condition.name': 1 });

module.exports = mongoose.model('ImageAnalysis', imageAnalysisSchema);
