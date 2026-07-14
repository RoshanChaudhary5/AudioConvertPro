/**
 * 404 handler - runs when no route matched the request.
 */
function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

/**
 * Centralized error handler. Ensures every error response has a
 * consistent, predictable JSON shape and never leaks stack traces
 * in production.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  // Multer-specific error messages are more useful to the client verbatim
  let message = err.message || 'Something went wrong on the server.';

  if (err.code === 'LIMIT_FILE_SIZE') {
    message = `File exceeds the maximum allowed upload size.`;
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(isProd ? {} : { stack: err.stack }),
  });
}

module.exports = { notFound, errorHandler };
