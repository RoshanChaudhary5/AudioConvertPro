const express = require('express');

const router = express.Router();

/**
 * GET /api/status/:id
 * Returns the current status of an upload/conversion job so the frontend
 * can poll and update its progress UI.
 */
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      const err = new Error('Invalid job ID format.');
      err.status = 400;
      throw err;
    }
    
    const job = req.app.locals.jobs.get(id);
    if (!job) {
      const err = new Error('Job not found.');
      err.status = 404;
      throw err;
    }
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
