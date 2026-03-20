const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { generateToken } = require('../middleware/auth');

// Demo credentials for quick access
const DEMO_EMAIL = 'snehashaw1525@gmail.com';
const DEMO_PASSWORD = 'sneha25';
const DEMO_USER_ID = '65f1a2b3c4d5e6f7a8b9c0d1';
const DEMO_USER = {
    id: DEMO_USER_ID,
    name: 'Sneha Shaw',
    email: DEMO_EMAIL,
    age: 25,
    gender: 'Female',
    medicalHistory: { comorbidities: ['none'], allergies: [], currentMedications: [] }
};

// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Please select a valid gender')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password, age, gender, medicalHistory } = req.body;

        // Check if user exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const { data: user, error } = await supabase
            .from('users')
            .insert({
                name,
                email,
                password_hash: passwordHash,
                age,
                gender,
                medical_history: medicalHistory || { comorbidities: ['none'], allergies: [], currentMedications: [] }
            })
            .select('id, name, email, age, gender, medical_history')
            .single();

        if (error) throw error;

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                medicalHistory: user.medical_history
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
});

// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Please provide a password')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Demo credentials bypass
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
            const token = generateToken(DEMO_USER_ID);
            return res.status(200).json({
                success: true,
                message: 'Login successful (Demo Account)',
                token,
                user: DEMO_USER
            });
        }

        // Find user in Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, password_hash, age, gender, medical_history')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                medicalHistory: user.medical_history
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
    }
});

// @route   GET /api/auth/me
// @access  Private
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
    try {
        // Demo user bypass
        if (req.user.id === DEMO_USER_ID) {
            return res.status(200).json({ success: true, user: req.user });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, age, gender, medical_history, created_at')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                medicalHistory: user.medical_history
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user data', error: error.message });
    }
});

module.exports = router;
