const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

/**
 * GET /api/download/:filename
 * Streams a converted MP3 file to the client. The filename is validated
 * against path traversal and confirmed to live inside the converted
 * directory before being served.
 */
router.get('/:filename', (req, res, next) => {
  try {
    const requested = path.basename(req.params.filename); // strips any path traversal
    
    // Additional validation to ensure filename is safe
    if (!requested || requested === '.' || requested === '..' || requested.length > 255) {
      const err = new Error('Invalid filename.');
      err.status = 400;
      throw err;
    }
    
    const filePath = path.join(req.app.locals.convertedDir, requested);
    const resolved = path.resolve(filePath);
    const convertedDirResolved = path.resolve(req.app.locals.convertedDir);

    if (!resolved.startsWith(convertedDirResolved)) {
      const err = new Error('Invalid file path.');
      err.status = 400;
      throw err;
    }

    if (!fs.existsSync(resolved)) {
      const err = new Error('File not found or has already been cleaned up.');
      err.status = 404;
      throw err;
    }

    res.download(resolved, requested, (err) => {
      if (err) next(err);
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
