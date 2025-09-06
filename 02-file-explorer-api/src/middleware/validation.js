const validation = {
  // Validate user registration
  validateRegistration: (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    next();
  },

  // Validate login
  validateLogin: (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username || typeof username !== 'string') {
      errors.push('Username is required');
    }

    if (!password || typeof password !== 'string') {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    next();
  },

  // Validate file path
  validateFilePath: (req, res, next) => {
    const { path } = req.query;
    
    if (path && typeof path !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Path must be a string'
      });
    }

    // Check for path traversal attempts
    if (path && (path.includes('..') || path.includes('~'))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid path'
      });
    }

    next();
  }
};

module.exports = validation;
