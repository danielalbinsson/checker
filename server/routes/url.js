const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const { body, validationResult } = require('express-validator');


// Add a new URL
router.post('/addurl', [
  body('url').isURL().withMessage('Enter a valid URL'),
], async (req, res) => {
  console.log('Add URL request body:', req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { url } = req.body;
    const newUrl = new Url({ user: req.user.userId, url });
    await newUrl.save();
    res.status(201).json({ message: 'URL added successfully', url: newUrl });
  } catch (error) {
    console.error('Error adding URL:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a URL
router.delete('/removeurl/:id', async (req, res) => {
  console.log('Remove URL request params:', req.params);
  try {
    const url = await Url.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    res.status(200).json({ message: 'URL removed successfully' });
  } catch (error) {
    console.error('Error removing URL:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all URLs for the authenticated user
router.get('/geturls', async (req, res) => {
  console.log('Get URLs request for user:', req.user.userId);
  try {
    const urls = await Url.find({ user: req.user.userId }).sort({ dateAdded: -1 });
    res.status(200).json(urls);
  } catch (error) {
    console.error('Error retrieving URLs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
