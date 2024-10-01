const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const { body, validationResult } = require('express-validator');
const authenticate = require('../middleware/authenticate'); // Import the authentication middleware

// Add a new URL (protected route)
router.post('/addurl', authenticate, [
  body('url').isURL().withMessage('Enter a valid URL'),
  body('frequency').isNumeric().withMessage('Frequency must be a number'),
], async (req, res) => {
  console.log('Add URL request body:', req.body); // Check request body in logs
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { url, frequency } = req.body;
    const newUrl = new Url({ 
      user: req.user._id, 
      url, 
      frequency, 
    });

    await newUrl.save();
    console.log('Saved URL:', newUrl); // Log saved document
    res.status(201).json({ message: 'URL added successfully', url: newUrl });
  } catch (error) {
    console.error('Error adding URL:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Remove a URL (protected route)
router.delete('/removeurl/:id', authenticate, async (req, res) => {
  console.log('Remove URL request params:', req.params);
  try {
    const url = await Url.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    res.status(200).json({ message: 'URL removed successfully' });
  } catch (error) {
    console.error('Error removing URL:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all URLs for the authenticated user (protected route)
router.get('/geturls', authenticate, async (req, res) => {
  console.log('Get URLs request for user:', req.user._id);
  try {
    const urls = await Url.find({ user: req.user._id }).sort({ dateAdded: -1 });
    res.status(200).json(urls);
  } catch (error) {
    console.error('Error retrieving URLs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
