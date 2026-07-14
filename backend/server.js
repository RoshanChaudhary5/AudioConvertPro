/**
 * AudioConvert Pro - Backend Server
 * -----------------------------------
 * Express server that exposes a small REST API used to upload MP4 files,
 * convert them to MP3 using FFmpeg, and serve the resulting audio for
 * download. All processing happens on files the user explicitly uploads;
 * the server never fetches or extracts media from third-party platforms.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');

const uploadRoutes = require('./routes/upload');
const convertRoutes = require('./routes/convert');
const downloadRoutes = require('./routes/download');
const deleteRoutes = require('./routes/delete');
const statusRoutes = require('./routes/status');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter, uploadLimiter } = require('./middleware/rateLimiter');
const { cleanupExpiredFiles } = require('./utils/fileCleanup');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Ensure required storage directories exist
// ---------------------------------------------------------------------------
const UPLOAD_DIR = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
const CONVERTED_DIR = path.join(__dirname, process.env.CONVERTED_DIR || 'converted');
[UPLOAD_DIR, CONVERTED_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
app.locals.uploadDir = UPLOAD_DIR;
app.locals.convertedDir = CONVERTED_DIR;

// In-memory job store: { id: { status, progress, ...meta } }
app.locals.jobs = new Map();

// ---------------------------------------------------------------------------
// Security & core middleware
// ---------------------------------------------------------------------------
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser tools (no origin) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  maxAge: 86400, // Cache preflight requests for 24 hours
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Security middleware to block common attacks
app.use((req, res, next) => {
  // Block requests with suspicious patterns in URL
  const suspiciousPatterns = [/\.\.\//, /\.\.\\/, /%2e%2e%2f/i, /%2e%2e\\/i];
  const url = req.url;
  
  if (suspiciousPatterns.some(pattern => pattern.test(url))) {
    return res.status(400).json({ success: false, error: 'Invalid request.' });
  }
  
  next();
});

// Input sanitization middleware
app.use((req, res, next) => {
  // Sanitize request body to prevent NoSQL injection and XSS
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  next();
});

function sanitizeObject(obj, depth = 0) {
  if (depth > 10) return obj; // Prevent deep recursion attacks
  
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string') {
      // Remove null bytes and control characters
      return obj.replace(/[\x00-\x1f\x7f]/g, '').slice(0, 10000);
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key
    const cleanKey = key.replace(/[^a-zA-Z0-9_$]/g, '').slice(0, 100);
    if (cleanKey) {
      sanitized[cleanKey] = sanitizeObject(value, depth + 1);
    }
  }
  return sanitized;
}

app.use('/api/', apiLimiter);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AudioConvert Pro API is running', timestamp: new Date().toISOString() });
});

app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/delete', deleteRoutes);
app.use('/api/status', statusRoutes);

// 404 + centralized error handling
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Scheduled cleanup of expired temporary files and memory jobs
// ---------------------------------------------------------------------------
const cleanupIntervalMinutes = parseInt(process.env.CLEANUP_INTERVAL_MINUTES || '15', 10);
cron.schedule(`*/${cleanupIntervalMinutes} * * * *`, () => {
  cleanupExpiredFiles(UPLOAD_DIR, CONVERTED_DIR);
  cleanupExpiredJobs();
});

/**
 * Removes completed/error/cancelled jobs from memory after retention period
 * to prevent memory leaks in long-running servers.
 */
function cleanupExpiredJobs() {
  const retentionMs = parseInt(process.env.FILE_RETENTION_MINUTES || '60', 10) * 60 * 1000;
  const now = Date.now();
  const jobs = app.locals.jobs;
  
  for (const [id, job] of jobs.entries()) {
    if (job.createdAt && (now - job.createdAt > retentionMs)) {
      if (job.status === 'completed' || job.status === 'error' || job.status === 'cancelled') {
        jobs.delete(id);
      }
    }
  }
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`AudioConvert Pro API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
