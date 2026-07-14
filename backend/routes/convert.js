const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { convertToMp3, VALID_BITRATES } = require('../utils/ffmpegService');
const { sanitizeMetadata } = require('../middleware/validateFile');

const router = express.Router();

// ---------------------------------------------------------------
// Concurrency limiter — prevents the server from spawning too many
// FFmpeg processes at once when users queue 100+ files.
// ---------------------------------------------------------------
const MAX_CONCURRENT_CONVERSIONS = parseInt(process.env.MAX_CONCURRENT_CONVERSIONS || '4', 10);
const activeControllers = new Map();    // jobId -> AbortController
const conversionQueue = [];              // { job, resolve, reject }
let activeCount = 0;

/**
 * Runs as many pending conversions as the concurrency limit allows.
 */
function processQueue() {
  while (activeCount < MAX_CONCURRENT_CONVERSIONS && conversionQueue.length > 0) {
    const entry = conversionQueue.shift();
    activeCount++;
    executeConversion(entry).finally(() => {
      activeCount--;
      processQueue();
    });
  }
}

/**
 * Performs the actual FFmpeg work for a single conversion entry.
 * @param {object} entry  - { job, resolve, reject }
 */
async function executeConversion({ job, resolve, reject }) {
  const { jobId, inputPath, outputPath, bitrate, metadata, onProgress, signal, app } = job;

  try {
    await convertToMp3(inputPath, outputPath, { bitrate, metadata }, onProgress, signal);

    // Mark completed in the job store
    const current = app.locals.jobs.get(jobId);
    if (current) {
      current.status = 'completed';
      current.progress = 100;
      current.convertedFilename = path.basename(outputPath);
      app.locals.jobs.set(jobId, current);
    }
    activeControllers.delete(jobId);
    resolve();
  } catch (err) {
    const current = app.locals.jobs.get(jobId);
    if (current) {
      current.status = current.status === 'cancelled' ? 'cancelled' : 'error';
      current.error = err.message;
      app.locals.jobs.set(jobId, current);
    }
    activeControllers.delete(jobId);
    reject(err);
  }
}

/**
 * POST /api/convert
 * Body: { jobId, bitrate, metadata? }
 * Starts (or restarts) conversion of a previously uploaded file. Progress
 * can be polled via GET /api/status/:id. This kicks off conversion
 * asynchronously and returns immediately with 202 Accepted.
 */
router.post('/', async (req, res, next) => {
  try {
    const { jobId, bitrate = process.env.DEFAULT_AUDIO_BITRATE || '192', metadata } = req.body;

    if (!jobId) {
      const err = new Error('jobId is required.');
      err.status = 400;
      throw err;
    }

    // Validate jobId format to prevent injection
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(jobId)) {
      const err = new Error('Invalid job ID format.');
      err.status = 400;
      throw err;
    }

    const job = req.app.locals.jobs.get(jobId);
    if (!job) {
      const err = new Error('No upload found for that job id. Please upload the file again.');
      err.status = 404;
      throw err;
    }

    if (!VALID_BITRATES.includes(String(bitrate))) {
      const err = new Error(`Invalid bitrate. Choose one of: ${VALID_BITRATES.join(', ')} kbps.`);
      err.status = 400;
      throw err;
    }

    const inputPath = path.join(req.app.locals.uploadDir, job.storedFilename);
    if (!fs.existsSync(inputPath)) {
      const err = new Error('Uploaded file is no longer available. Please upload it again.');
      err.status = 404;
      throw err;
    }

    const outputFilename = `${path.basename(job.storedFilename, path.extname(job.storedFilename))}.mp3`;
    const outputPath = path.join(req.app.locals.convertedDir, outputFilename);

    job.status = 'converting';
    job.progress = 0;
    job.bitrate = bitrate;
    req.app.locals.jobs.set(jobId, job);

    // Respond immediately; client polls /api/status/:id for progress.
    res.status(202).json({ success: true, message: 'Conversion started.', jobId });

    const controller = new AbortController();
    activeControllers.set(jobId, controller);

    // Sanitize metadata to prevent command injection
    const sanitizedMetadata = metadata ? {
      title: sanitizeMetadata(metadata.title),
      artist: sanitizeMetadata(metadata.artist),
      album: sanitizeMetadata(metadata.album),
    } : undefined;

    // Wrap the work into a queue entry so we can limit concurrency
    const onProgress = (percent) => {
      const current = req.app.locals.jobs.get(jobId);
      if (current) {
        current.progress = percent;
        req.app.locals.jobs.set(jobId, current);
      }
    };

    // Enqueue conversion work instead of running it immediately
    const conversionPromise = new Promise((resolve, reject) => {
      conversionQueue.push({
        job: {
          jobId,
          inputPath,
          outputPath,
          bitrate,
          metadata: sanitizedMetadata,
          onProgress,
          signal: controller.signal,
          app: req.app,
        },
        resolve,
        reject,
      });
    });

    processQueue();

    // Wait for the conversion to finish (may be queued behind others)
    conversionPromise
      .then(() => {
        activeControllers.delete(jobId);
      })
      .catch((err) => {
        // Error is already handled inside executeConversion, but
        // we catch here to prevent unhandled promise rejection.
        activeControllers.delete(jobId);
      });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/convert/:id/cancel
 * Cancels an in-progress conversion.
 */
router.post('/:id/cancel', (req, res, next) => {
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
    const controller = activeControllers.get(id);
    if (controller) {
      job.status = 'cancelled';
      req.app.locals.jobs.set(id, job);
      controller.abort();
    }
    res.json({ success: true, message: 'Conversion cancelled.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
