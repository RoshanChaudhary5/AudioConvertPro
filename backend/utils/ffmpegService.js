const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobeStatic = (() => {
  try {
    // Optional: use ffprobe-static if present; fluent-ffmpeg can fall back
    // to system ffprobe if this isn't installed.
    // eslint-disable-next-line global-require
    return require('ffprobe-static').path;
  } catch {
    return null;
  }
})();
const { sanitizeMetadata } = require('../middleware/validateFile');

ffmpeg.setFfmpegPath(ffmpegPath);
if (ffprobeStatic) ffmpeg.setFfprobePath(ffprobeStatic);

const VALID_BITRATES = ['128', '192', '256', '320'];

/**
 * Reads media metadata (duration, format, etc.) for an uploaded file.
 * @param {string} filePath
 * @returns {Promise<object>}
 */
function probeFile(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      return resolve(metadata);
    });
  });
}

/**
 * Converts an MP4 file to an MP3 file at the requested bitrate, reporting
 * progress via the onProgress callback (0-100).
 *
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {object} options
 * @param {string} options.bitrate - one of '128' | '192' | '256' | '320'
 * @param {object} [options.metadata] - optional ID3 tags { title, artist, album }
 * @param {(percent:number)=>void} onProgress
 * @param {AbortSignal} [signal] - optional abort signal to support cancellation
 */
function convertToMp3(inputPath, outputPath, options, onProgress, signal) {
  const bitrate = VALID_BITRATES.includes(String(options.bitrate)) ? String(options.bitrate) : '192';

  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate(`${bitrate}k`)
      .format('mp3');

    if (options.metadata) {
      const { title, artist, album } = options.metadata;
      const tags = [];
      if (title) tags.push(`title=${sanitizeMetadata(title)}`);
      if (artist) tags.push(`artist=${sanitizeMetadata(artist)}`);
      if (album) tags.push(`album=${sanitizeMetadata(album)}`);
      if (tags.length) command.outputOptions(tags.map((t) => `-metadata ${t}`));
    }

    command
      .on('progress', (progress) => {
        if (onProgress && typeof progress.percent === 'number') {
          onProgress(Math.min(100, Math.max(0, Math.round(progress.percent))));
        }
      })
      .on('error', (err) => reject(err))
      .on('end', () => resolve(outputPath))
      .save(outputPath);

    if (signal) {
      signal.addEventListener('abort', () => {
        command.kill('SIGKILL');
        reject(new Error('Conversion cancelled by user.'));
      });
    }
  });
}

module.exports = { probeFile, convertToMp3, VALID_BITRATES };
