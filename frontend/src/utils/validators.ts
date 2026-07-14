export const ACCEPTED_MIME_TYPES = ['video/mp4'];
export const ACCEPTED_EXTENSIONS = ['.mp4'];
export const MAX_UPLOAD_SIZE_MB = 500;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates a File object client-side before it's ever uploaded, giving
 * the user instant feedback rather than waiting on a round trip.
 */
export function validateMp4File(file: File): FileValidationResult {
  const lowerName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const hasValidMime = ACCEPTED_MIME_TYPES.includes(file.type) || file.type === '';

  if (!hasValidExtension) {
    return { valid: false, message: 'Only .mp4 files are supported.' };
  }
  if (!hasValidMime) {
    return { valid: false, message: 'This file does not appear to be a valid MP4 video.' };
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return { valid: false, message: `File is too large. Maximum size is ${MAX_UPLOAD_SIZE_MB} MB.` };
  }
  if (file.size === 0) {
    return { valid: false, message: 'This file appears to be empty.' };
  }
  return { valid: true };
}
