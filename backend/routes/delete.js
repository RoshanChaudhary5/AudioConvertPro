const express = require('express');
const path = require('path');
const { deleteFileIfExists } = require('../utils/fileCleanup');

const router = express.Router();

/**
 * DELETE /api/delete/:filename
 * Explicitly removes an uploaded or converted file (e.g. when the user
 * clicks "remove" before converting, or to clean up after download).
 * Filename is sanitized against path traversal.
 */
router.delete('/:filename', async (req, res, next) => {
  try {
    const requested = path.basename(req.params.filename);
    
    // Validate filename to prevent path traversal
    if (!requested || requested === '.' || requested === '..') {
      const err = new Error('Invalid filename.');
      err.status = 400;
      throw err;
    }

    const uploadPath = path.join(req.app.locals.uploadDir, requested);
    const convertedPath = path.join(req.app.locals.convertedDir, requested);
    
    // Resolve and verify paths are within allowed directories
    const resolvedUpload = path.resolve(uploadPath);
    const resolvedConverted = path.resolve(convertedPath);
    const uploadDirResolved = path.resolve(req.app.locals.uploadDir);
    const convertedDirResolved = path.resolve(req.app.locals.convertedDir);
    
    if (!resolvedUpload.startsWith(uploadDirResolved) && !resolvedConverted.startsWith(convertedDirResolved)) {
      const err = new Error('Invalid file path.');
      err.status = 400;
      throw err;
    }

    const removedUpload = await deleteFileIfExists(resolvedUpload);
    const removedConverted = await deleteFileIfExists(resolvedConverted);

    if (!removedUpload && !removedConverted) {
      const err = new Error('File not found.');
      err.status = 404;
      throw err;
    }

    res.json({ success: true, message: 'File deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
