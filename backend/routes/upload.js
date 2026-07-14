const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { mp4FileFilter, sanitizeFilename, validateMp4MagicNumbers } = require('../middleware/validateFile');
const { probeFile } = require('../utils/ffmpegService');

const router = express.Router();

const MAX_UPLOAD_SIZE_MB = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '500', 10);
const MAX_UPLOAD_FILES = parseInt(process.env.MAX_UPLOAD_FILES || '200', 10);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, req.app.locals.uploadDir);
  },
  filename: (req, file, cb) => {
    const safe = sanitizeFilename(file.originalname);
    const unique = `${uuidv4()}-${safe}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  fileFilter: mp4FileFilter,
  limits: { fileSize: MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
});

/**
 * POST /api/upload
 * Accepts a single MP4 file (field name: "file") or multiple files
 * (field name: "files") for queue-based conversion. Returns metadata
 * (id, filename, size, duration) that the client uses for subsequent
 * /api/convert calls.
 */
router.post('/', upload.array('files', MAX_UPLOAD_FILES), async (req, res, next) => {
  try {
    const files = req.files && req.files.length ? req.files : (req.file ? [req.file] : []);

    if (!files.length) {
      const err = new Error('No file was uploaded. Please select an MP4 file.');
      err.status = 400;
      throw err;
    }

    const results = await Promise.all(
      files.map(async (file) => {
        // Validate magic numbers to ensure file is actually an MP4
        const isValidMp4 = await validateMp4MagicNumbers(file.path);
        if (!isValidMp4) {
          // Delete the invalid file
          try { await fs.promises.unlink(file.path); } catch {}
          const err = new Error(`File "${file.originalname}" is not a valid MP4 file.`);
          err.status = 400;
          throw err;
        }

        let duration = null;
        try {
          const metadata = await probeFile(file.path);
          duration = metadata.format && metadata.format.duration ? Math.round(metadata.format.duration) : null;
        } catch {
          duration = null;
        }

        const id = uuidv4();
        req.app.locals.jobs.set(id, {
          id,
          status: 'uploaded',
          progress: 0,
          originalName: file.originalname,
          storedFilename: file.filename,
          size: file.size,
          duration,
          createdAt: Date.now(),
        });

        return {
          id,
          originalName: file.originalname,
          storedFilename: file.filename,
          size: file.size,
          duration,
        };
      })
    );

    res.status(201).json({ success: true, message: 'File(s) uploaded successfully.', files: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
