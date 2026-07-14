const fs = require('fs');
const path = require('path');

const RETENTION_MS = () => parseInt(process.env.FILE_RETENTION_MINUTES || '60', 10) * 60 * 1000;

/**
 * Deletes files older than the configured retention window from the
 * given directories. Runs on a schedule from server.js and can also be
 * invoked manually (e.g. right after a file is downloaded).
 */
function cleanupExpiredFiles(...dirs) {
  const now = Date.now();
  const maxAge = RETENTION_MS();

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) return;
    fs.readdir(dir, (err, files) => {
      if (err) return;
      files.forEach((file) => {
        if (file === '.gitkeep') return;
        const filePath = path.join(dir, file);
        fs.stat(filePath, (statErr, stats) => {
          if (statErr) return;
          if (now - stats.mtimeMs > maxAge) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
  });
}

/**
 * Immediately removes a single file if it exists. Used after a
 * successful download or an explicit delete request.
 */
function deleteFileIfExists(filePath) {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) return resolve(false);
      fs.unlink(filePath, () => resolve(true));
    });
  });
}

module.exports = { cleanupExpiredFiles, deleteFileIfExists };
