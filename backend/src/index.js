const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const ApiError = require('./utils/ApiError');
const requestTiming = require('./middlewares/requestTiming');
const requestTimeout = require('./middlewares/requestTimeout');

// ─── Create Express App ──────────────────────────────────────────────────────

const app = express();

// ─── Global Middlewares ──────────────────────────────────────────────────────

// HTTP request logging (concise in production, detailed in development)
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// Timeout middleware (10 seconds)
app.use(requestTimeout(10000));

// Request timing middleware (log slow requests > 200ms)
app.use(requestTiming(200));

// Compression middleware for gzip/brotli
app.use(compression());

// Security headers
app.use(helmet());

// CORS
app.use(cors({ origin: config.cors.origin }));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Minta Salon API is running.',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────

app.use('/api', routes);

// ─── 404 Handler for API Routes ──────────────────────────────────────────────

app.use('/api', (req, res, next) => {
  next(ApiError.notFound(`API Route ${req.method} ${req.originalUrl} not found.`));
});

// ─── React Router Catch-All ──────────────────────────────────────────────────

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// ─── Global Error Handler ────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────

const server = app.listen(config.port, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║                                                  ║
  ║   🏪  MINTA SALON API                            ║
  ║                                                  ║
  ║   Environment : ${config.env.padEnd(30)}║
  ║   Port        : ${String(config.port).padEnd(30)}║
  ║   URL         : http://localhost:${config.port}${' '.repeat(14)}║
  ║                                                  ║
  ╚══════════════════════════════════════════════════╝
  `);
  console.log('Active handles:', process._getActiveHandles().length);
});

process.on('exit', (code) => {
  console.log('Process exiting with code:', code);
});

// ─── Graceful Shutdown ───────────────────────────────────────────────────────

const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app;
