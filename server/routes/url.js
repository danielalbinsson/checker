const express = require('express');
const router = express.Router();
const axios = require('axios');
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

// Helper function to normalize URLs by adding the protocol if missing
const normalizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'http://' + url;
  }
  return url;
};

// Check the status of a specific URL (protected route)
router.post('/checkurl', authenticate, async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  const normalizedUrl = normalizeUrl(url);
  console.log(`Checking URL: ${normalizedUrl}`);
  
  try {
    // Use a HEAD request to check if the URL is reachable
    const response = await axios.head(normalizedUrl);
    console.log('Response status:', response.status);  // Log the status code

    // Save the successful check in the database
    const urlDoc = await Url.findOneAndUpdate(
      { url: normalizedUrl, user: req.user._id },  // Match URL and user
      { 
        $push: { checks: { statusCode: response.status, checkedAt: new Date() } }  // Add new check
      },
      { new: true, upsert: true }  // Return the updated document, create if not found
    );

    console.log('Updated URL document:', urlDoc);  // Log the updated document

    res.status(200).json({
      url: normalizedUrl,
      status: response.status,
      headers: response.headers,
      message: 'URL is reachable',
      checks: urlDoc.checks  // Return the updated checks array
    });
  } catch (error) {
    console.error('Error checking URL:', error.message);

    // Handle specific errors (e.g., ENOTFOUND) and save failed check
    let statusCode = 500;  // Default to 500 for unknown errors
    let errorMessage = error.message;

    if (error.code === 'ENOTFOUND') {
      statusCode = 404;  // Set a 404 error code for DNS resolution issues
      errorMessage = 'Domain not found';
    } else if (error.response) {
      statusCode = error.response.status;  // Set the status code if available from the response
      errorMessage = `URL returned error: ${error.response.statusText}`;
    }

    // Save the failed check to the database
    try {
      const urlDoc = await Url.findOneAndUpdate(
        { url: normalizedUrl, user: req.user._id },
        { 
          $push: { checks: { statusCode, checkedAt: new Date(), errorMessage } }  // Save failed check
        },
        { new: true, upsert: true }
      );

      console.log('Updated URL document with failed check:', urlDoc);

      res.status(statusCode).json({
        url: normalizedUrl,
        status: statusCode,
        message: errorMessage,
        checks: urlDoc.checks
      });
    } catch (dbError) {
      console.error('Database update error:', dbError);
      res.status(500).json({ message: 'Failed to update the database with the check' });
    }
  }
});

module.exports = router;
