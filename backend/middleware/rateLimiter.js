const rateLimit = require('express-rate-limit');

const windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10);

/**
 * General API rate limiter. Protects upload/convert endpoints from abuse
 * while still allowing normal usage patterns (multiple files, retries).
 * Increased default to 1000 to support bulk conversions (100+ files
 * each requiring upload + conversion + polling requests).
 */
const apiLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
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
  windowMs: windowMinutes * 60 * 1000,
  max: Math.max(50, Math.round(maxRequests / 4)),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many upload requests. Please wait a moment and try again.',
  },
});

module.exports = { apiLimiter, uploadLimiter };
