const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Demo user for quick access (must match routes/auth.js)
const DEMO_USER_ID = '65f1a2b3c4d5e6f7a8b9c0d1';
const DEMO_USER = {
    id: DEMO_USER_ID,
    _id: DEMO_USER_ID,
    name: 'Sneha Shaw',
    email: 'snehashaw1525@gmail.com',
    age: 25,
    gender: 'Female',
    medicalHistory: { comorbidities: ['none'], allergies: [], currentMedications: [] }
};

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Handle demo user - skip MongoDB lookup
            if (decoded.id === DEMO_USER_ID) {
                req.user = DEMO_USER;
                return next();
            }

            // Get user from token
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

// Generate JWT Token
exports.generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};
