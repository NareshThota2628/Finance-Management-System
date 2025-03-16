require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initializeFirebase } = require('./firebase-admin');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const financeRoutes = require('./routes/finance.routes');
const aiRoutes = require('./routes/ai.routes');
const budgetRoutes = require('./routes/budget.routes');
const investmentRoutes = require('./routes/investment.routes');
const notificationRoutes = require('./routes/notification.routes');
const voiceRoutes = require('./routes/voice.routes');
const socialRoutes = require('./routes/social.routes');

// Initialize Express app
const app = express();


// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(helmet()); // Security headers
app.use(express.json({ limit: '10kb' })); // Body parser
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});
app.use(limiter);

// Initialize Firebase
initializeFirebase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/social', socialRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found.'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Global Error: ${err.message}`, {
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      params: req.params
    }
  });

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});