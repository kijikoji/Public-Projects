const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/user');
const config = require('../config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Verify user still exists
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(403).json({
        success: false,
        error: 'User not found'
      });
    }

    req.user = {
      id: user.id,
      username: user.username
    };
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (!err && decoded) {
      const user = findUserById(decoded.id);
      if (user) {
        req.user = {
          id: user.id,
          username: user.username
        };
      }
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  optionalAuth
};
