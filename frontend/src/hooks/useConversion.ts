import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Bitrate,
  cancelConversion,
  deleteFile,
  getDownloadUrl,
  getJobStatus,
  startConversion,
  uploadFiles,
} from '../services/api';
import { validateMp4File } from '../utils/validators';

export type QueueItemStatus =
  | 'idle'
  | 'uploading'
  | 'uploaded'
  | 'converting'
  | 'completed'
  | 'error'
  | 'cancelled';

export interface QueueItem {
  clientId: string; // stable id for React keys, generated client-side
  jobId: string | null; // server-assigned job id, set after upload
  file: File;
  status: QueueItemStatus;
  uploadProgress: number;
  conversionProgress: number;
  duration: number | null;
  bitrate: Bitrate;
  error?: string;
  convertedFilename?: string;
}

const POLL_INTERVAL_MS = 1200;
const MAX_CONCURRENT = 4; // max simultaneous upload+convert pipelines on client

export function useConversion() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const pollTimers = useRef<Record<string, number>>({});
  const queueRef = useRef<QueueItem[]>([]); // avoids stale closures

  // Keep queueRef in sync
  const setQueueBoth = useCallback((updater: QueueItem[] | ((prev: QueueItem[]) => QueueItem[])) => {
    setQueue((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      queueRef.current = next;
      return next;
    });
  }, []);

  const updateItem = useCallback((clientId: string, patch: Partial<QueueItem>) => {
    setQueueBoth((prev) =>
      prev.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item))
    );
  }, [setQueueBoth]);

  /** Adds files to the queue after client-side validation. */
  const addFiles = useCallback((files: File[]) => {
    const accepted: QueueItem[] = [];
    files.forEach((file) => {
      const result = validateMp4File(file);
      if (!result.valid) {
        toast.error(result.message || `${file.name} could not be added.`);
        return;
      }
      accepted.push({
        clientId: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        jobId: null,
        file,
        status: 'idle',
        uploadProgress: 0,
        conversionProgress: 0,
        duration: null,
        bitrate: '192',
      });
    });
    if (accepted.length) {
      setQueueBoth((prev) => [...prev, ...accepted]);
    }
  }, [setQueueBoth]);

  const setBitrate = useCallback(
    (clientId: string, bitrate: Bitrate) => updateItem(clientId, { bitrate }),
    [updateItem]
  );

  const removeItem = useCallback((clientId: string) => {
    setQueueBoth((prev) => {
      const item = prev.find((i) => i.clientId === clientId);
      if (item?.convertedFilename) {
        deleteFile(item.convertedFilename).catch(() => {});
      }
      return prev.filter((i) => i.clientId !== clientId);
    });
    const timer = pollTimers.current[clientId];
    if (timer) window.clearInterval(timer);
  }, [setQueueBoth]);

  const pollStatus = useCallback(
    (clientId: string, jobId: string) => {
      const timer = window.setInterval(async () => {
        try {
          const job = await getJobStatus(jobId);
          updateItem(clientId, {
            conversionProgress: job.progress,
            status: job.status === 'completed'
              ? 'completed'
              : job.status === 'error'
              ? 'error'
              : job.status === 'cancelled'
              ? 'cancelled'
              : 'converting',
            convertedFilename: job.convertedFilename,
            error: job.error,
          });

          if (job.status === 'completed' || job.status === 'error' || job.status === 'cancelled') {
            window.clearInterval(timer);
            delete pollTimers.current[clientId];
            if (job.status === 'completed') toast.success(`${job.originalName} converted successfully!`);
            if (job.status === 'error') toast.error(`Conversion failed: ${job.error || 'Unknown error'}`);
          }
        } catch (err) {
          window.clearInterval(timer);
          delete pollTimers.current[clientId];
          updateItem(clientId, { status: 'error', error: 'Lost connection while checking progress.' });
        }
      }, POLL_INTERVAL_MS);
      pollTimers.current[clientId] = timer;
    },
    [updateItem]
  );

  /** Runs the full upload -> convert pipeline for a single queue item. */
  const convertItem = useCallback(
    async (clientId: string) => {
      // Read from ref to avoid stale closure over queue state
      const items = queueRef.current;
      const item = items.find((i) => i.clientId === clientId);
      if (!item) return;

      try {
        updateItem(clientId, { status: 'uploading', uploadProgress: 0, error: undefined });
        const [uploaded] = await uploadFiles([item.file], (pct) => updateItem(clientId, { uploadProgress: pct }));
        updateItem(clientId, {
          status: 'uploaded',
          jobId: uploaded.id,
          duration: uploaded.duration,
          uploadProgress: 100,
        });

        updateItem(clientId, { status: 'converting', conversionProgress: 0 });
        await startConversion(uploaded.id, item.bitrate);
        pollStatus(clientId, uploaded.id);
      } catch (err: any) {
        const message = err?.response?.data?.error || 'Something went wrong. Please try again.';
        updateItem(clientId, { status: 'error', error: message });
        toast.error(message);
      }
    },
    [updateItem, pollStatus]
  );

  /**
   * Converts all idle files with a concurrency limit so we don't
   * overwhelm the browser or the server with 100 simultaneous uploads.
   */
  const convertAll = useCallback(async () => {
    const idleItems = queueRef.current.filter((i) => i.status === 'idle');
    if (idleItems.length === 0) return;

    // Process in batches of MAX_CONCURRENT
    for (let i = 0; i < idleItems.length; i += MAX_CONCURRENT) {
      const batch = idleItems.slice(i, i + MAX_CONCURRENT);
      await Promise.all(batch.map((item) => convertItem(item.clientId)));
    }
  }, [convertItem]);

  const cancelItem = useCallback(
    async (clientId: string) => {
      const items = queueRef.current;
      const item = items.find((i) => i.clientId === clientId);
      if (!item?.jobId) return;
      try {
        await cancelConversion(item.jobId);
        updateItem(clientId, { status: 'cancelled' });
        const timer = pollTimers.current[clientId];
        if (timer) window.clearInterval(timer);
      } catch {
        toast.error('Could not cancel the conversion.');
      }
    },
    [updateItem]
  );

  const downloadItem = useCallback((clientId: string) => {
    const items = queueRef.current;
    const item = items.find((i) => i.clientId === clientId);
    if (!item?.convertedFilename) return;
    
    // Sanitize filename to prevent XSS
    const sanitizedFilename = item.convertedFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    const link = document.createElement('a');
    link.href = getDownloadUrl(sanitizedFilename);
    link.download = sanitizedFilename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Clean up after a short delay to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  }, []);

  const resetItem = useCallback((clientId: string) => {
    updateItem(clientId, {
      status: 'idle',
      jobId: null,
      uploadProgress: 0,
      conversionProgress: 0,
      convertedFilename: undefined,
      error: undefined,
    });
  }, [updateItem]);

  const clearQueue = useCallback(() => {
    Object.values(pollTimers.current).forEach((t) => window.clearInterval(t));
    pollTimers.current = {};
    setQueue([]);
  }, []);

  return {
    queue,
    addFiles,
    setBitrate,
    removeItem,
    convertItem,
    convertAll,
    cancelItem,
    downloadItem,
    resetItem,
    clearQueue,
  };
}
