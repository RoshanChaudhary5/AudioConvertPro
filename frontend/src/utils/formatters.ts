/**
 * Formats a byte count into a human-readable string (KB, MB, GB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/**
 * Formats a duration in seconds as mm:ss (or h:mm:ss for longer files).
 */
export function formatDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null || Number.isNaN(totalSeconds)) return '--:--';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${minutes}:${pad(seconds)}`;
}

/**
 * Truncates a filename in the middle, keeping the extension visible.
 */
export function truncateFilename(name: string, maxLength = 28): string {
  if (name.length <= maxLength) return name;
  const extIndex = name.lastIndexOf('.');
  const ext = extIndex > -1 ? name.slice(extIndex) : '';
  const base = extIndex > -1 ? name.slice(0, extIndex) : name;
  const keep = maxLength - ext.length - 3;
  if (keep <= 0) return `${name.slice(0, maxLength)}…`;
  return `${base.slice(0, keep)}…${ext}`;
}
