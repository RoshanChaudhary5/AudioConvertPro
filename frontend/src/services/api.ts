import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 0, // uploads/conversions can take a while; rely on user-initiated cancel instead
});

export type Bitrate = '128' | '192' | '256' | '320';

export interface UploadedFileMeta {
  id: string;
  originalName: string;
  storedFilename: string;
  size: number;
  duration: number | null;
}

export interface JobStatus {
  id: string;
  status: 'uploaded' | 'converting' | 'completed' | 'error' | 'cancelled';
  progress: number;
  originalName: string;
  storedFilename: string;
  size: number;
  duration: number | null;
  bitrate?: Bitrate;
  convertedFilename?: string;
  error?: string;
}

/** Uploads one or more MP4 files, reporting upload progress via onProgress (0-100). */
export async function uploadFiles(
  files: File[],
  onProgress?: (percent: number) => void
): Promise<UploadedFileMeta[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });

  return response.data.files;
}

/** Starts server-side conversion for an uploaded job. */
export async function startConversion(
  jobId: string,
  bitrate: Bitrate,
  metadata?: { title?: string; artist?: string; album?: string }
): Promise<void> {
  await apiClient.post('/convert', { jobId, bitrate, metadata });
}

/** Polls the current status/progress of a conversion job. */
export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await apiClient.get(`/status/${jobId}`);
  return response.data.job;
}

/** Cancels an in-progress conversion. */
export async function cancelConversion(jobId: string): Promise<void> {
  await apiClient.post(`/convert/${jobId}/cancel`);
}

/** Builds the direct download URL for a converted MP3. */
export function getDownloadUrl(filename: string): string {
  return `${API_BASE_URL}/download/${encodeURIComponent(filename)}`;
}

/** Deletes a file (upload or converted) from server storage. */
export async function deleteFile(filename: string): Promise<void> {
  await apiClient.delete(`/delete/${encodeURIComponent(filename)}`);
}
