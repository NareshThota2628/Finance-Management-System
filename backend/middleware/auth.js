const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized: No token provided');
    return res.status(401).json({ 
      success: false,
      error: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await admin.auth().getUser(decoded.uid);

    if (!user) {
      logger.warn(`Unauthorized: Invalid user ID ${decoded.uid}`);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid user.'
      });
    }

    // Attach user to request
    req.user = {
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role || 'user'
    };

    logger.info(`Authenticated user: ${user.email}`);
    next();
  } catch (error) {
    logger.error(`Authentication Error: ${error.message}`);
    res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token.'
    });
  }
};