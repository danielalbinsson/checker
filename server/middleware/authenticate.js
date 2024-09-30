const User = require('../models/User'); // Assuming you have a User model

// Middleware to check if the user is authenticated
const authenticate = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Find the user by the session's userId
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user object to req.user
    req.user = user;
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authenticate;
