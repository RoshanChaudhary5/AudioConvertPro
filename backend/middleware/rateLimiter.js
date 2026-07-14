const rateLimit = require('express-rate-limit');

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10);
const uploadMaxRequests = parseInt(process.env.UPLOAD_RATE_LIMIT_MAX || '250', 10);

/**
 * General API rate limiter. Protects upload/convert endpoints from abuse
 * while still allowing normal usage patterns (multiple files, retries).
 * Increased default to 1000 to support bulk conversions (100+ files
 * each requiring upload + conversion + polling requests).
 */
const apiLimiter = rateLimit({
  windowMs: windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please wait a moment and try again.',
  },
});

/**
 * Stricter rate limiter for uploads specifically — prevents a single
 * user from saturating disk/storage with massive uploads.
 */
const uploadLimiter = rateLimit({
  windowMs: windowMs,
  max: uploadMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many upload requests. Please wait a moment and try again.',
  },
});

module.exports = { apiLimiter, uploadLimiter };
