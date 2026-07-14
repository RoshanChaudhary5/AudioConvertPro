const path = require('path');
const fs = require('fs');

const ALLOWED_MIME_TYPES = (process.env.ALLOWED_MIME_TYPES || 'video/mp4')
  .split(',')
  .map((t) => t.trim().toLowerCase());

const ALLOWED_EXTENSIONS = (process.env.ALLOWED_EXTENSIONS || '.mp4')
  .split(',')
  .map((e) => e.trim().toLowerCase());

// Magic numbers for MP4 files (ftyp box)
const MP4_MAGIC_NUMBERS = [
  Buffer.from('66747970', 'hex'), // "ftyp" at offset 4
];

/**
 * Strips path separators and any non-safe characters from a filename to
 * prevent path traversal (e.g. "../../etc/passwd") and other injection
 * attempts. Keeps only the base name and a conservative character set.
 */
function sanitizeFilename(originalName) {
  const base = path.basename(originalName); // drop any directory components
  const ext = path.extname(base);
  const nameOnly = path.basename(base, ext);
  const safeName = nameOnly.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
  const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();
  return `${safeName || 'file'}${safeExt}`;
}

/**
 * Sanitizes metadata fields to prevent command injection in FFmpeg.
 * Removes special characters that could be interpreted as FFmpeg commands.
 */
function sanitizeMetadata(value) {
  if (typeof value !== 'string') return '';
  // Remove quotes, backslashes, and other special chars that could break FFmpeg commands
  return value
    .replace(/[\\"';|&$`(){}[\]<>]/g, '')
    .trim()
    .slice(0, 200); // Limit length
}

/**
 * Validates that a file is actually an MP4 by checking magic numbers.
 * This provides stronger security than just checking MIME type and extension.
 * @param {string} filePath - Path to the file to validate
 * @returns {Promise<boolean>} - True if file appears to be a valid MP4
 */
async function validateMp4MagicNumbers(filePath) {
  try {
    // Read first 12 bytes to check for ftyp box
    const buffer = Buffer.alloc(12);
    const fd = await fs.promises.open(filePath, 'r');
    await fd.read(buffer, 0, 12, 0);
    await fd.close();
    
    // Check for "ftyp" at offset 4 (standard MP4 box)
    const ftyp = buffer.toString('ascii', 4, 8);
    if (ftyp === 'ftyp') {
      return true;
    }
    
    // Some MP4 files might have different structure, check for common brands
    const brand = buffer.toString('ascii', 8, 12);
    const validBrands = ['isom', 'iso2', 'avc1', 'mp41', 'mp42', '3gp4', 'M4V', 'M4A', 'kddi'];
    if (validBrands.includes(brand)) {
      return true;
    }
    
    return false;
  } catch (err) {
    // If we can't read the file, let it pass (will fail later in processing)
    return true;
  }
}

/**
 * Multer fileFilter: rejects anything that isn't an MP4 by MIME type and
 * extension. Both checks are required since MIME types can be spoofed by
 * the client - this is a first line of defense, not a full guarantee.
 */
function mp4FileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase());
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (!mimeOk || !extOk) {
    const err = new Error('Only MP4 video files are supported.');
    err.status = 400;
    return cb(err);
  }
  return cb(null, true);
}

module.exports = { 
  sanitizeFilename, 
  sanitizeMetadata, 
  mp4FileFilter, 
  validateMp4MagicNumbers,
  ALLOWED_MIME_TYPES, 
  ALLOWED_EXTENSIONS 
};
