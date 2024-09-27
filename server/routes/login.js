const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Import bcrypt
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').exists().withMessage('Password is required'),
], async (req, res) => {
  console.log('Received login request:', req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return the first error message
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json({ message: 'Login successful' });
      // Optionally, generate and send a JWT token here
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
