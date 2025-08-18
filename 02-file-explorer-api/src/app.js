const express = require('express');
const morgan = require('morgan');
const fileRoutes = require('./routes/fileRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/files', fileRoutes);

// Error handler (after routes)
app.use(errorHandler);

module.exports = app;
