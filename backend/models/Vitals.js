const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    heartRate: {
        type: Number,
        required: true,
        min: 30,
        max: 250
    },
    spo2: {
        type: Number,
        required: true,
        min: 50,
        max: 100
    },
    temperature: {
        type: Number,
        required: true,
        min: 90,
        max: 110
    },
    bloodPressure: {
        systolic: { type: Number, min: 60, max: 250 },
        diastolic: { type: Number, min: 40, max: 150 }
    },
    steps: {
        type: Number,
        default: 0,
        min: 0
    },
    device: {
        type: String,
        enum: ['fitbit', 'apple_watch', 'generic_sensor', 'manual'],
        default: 'generic_sensor'
    },
    status: {
        type: String,
        enum: ['normal', 'warning', 'critical'],
        default: 'normal'
    }
}, {
    timestamps: true
});

vitalsSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Vitals', vitalsSchema);
