import { motion } from 'framer-motion';
import { FiDownload, FiX, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiFilm } from 'react-icons/fi';
import { QueueItem } from '../hooks/useConversion';
import { formatFileSize, formatDuration, truncateFilename } from '../utils/formatters';
import ProgressCircle from './ProgressCircle';
import QualitySelector from './QualitySelector';
import Waveform from './Waveform';
import { Bitrate } from '../services/api';

interface FileCardProps {
  item: QueueItem;
  onConvert: (id: string) => void;
  onCancel: (id: string) => void;
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
  onReset: (id: string) => void;
  onBitrateChange: (id: string, bitrate: Bitrate) => void;
}

export default function FileCard({
  item,
  onConvert,
  onCancel,
  onDownload,
  onRemove,
  onReset,
  onBitrateChange,
}: FileCardProps) {
  const { status } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="glass-card p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white">
          <FiFilm size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate font-display text-sm font-semibold text-ink-900 dark:text-white" title={item.file.name}>
                {truncateFilename(item.file.name)}
              </h4>
              <p className="mt-0.5 text-xs text-ink-500 dark:text-mist-200/60">
                {formatFileSize(item.file.size)}
                {item.duration != null && ` • ${formatDuration(item.duration)}`}
              </p>
            </div>

            {status !== 'converting' && status !== 'uploading' && (
              <button
                type="button"
                onClick={() => onRemove(item.clientId)}
                aria-label="Remove file"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-coral-500/10 hover:text-coral-500"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Status-specific body */}
          <div className="mt-4">
            {status === 'idle' && (
              <div className="space-y-4">
                <QualitySelector value={item.bitrate} onChange={(b) => onBitrateChange(item.clientId, b)} />
                <button type="button" onClick={() => onConvert(item.clientId)} className="btn-primary w-full sm:w-auto">
                  Convert to MP3
                </button>
              </div>
            )}

            {status === 'uploading' && (
              <StatusRow
                circleProgress={item.uploadProgress}
                label="Uploading…"
                sublabel={`${item.uploadProgress}% uploaded`}
              />
            )}

            {(status === 'uploaded' || status === 'converting') && (
              <div className="flex items-center gap-4">
                <ProgressCircle progress={status === 'converting' ? item.conversionProgress : 4} />
                <div className="flex-1">
                  <p className="font-display text-sm font-semibold text-ink-800 dark:text-mist-100">
                    Converting to MP3 ({item.bitrate} kbps)…
                  </p>
                  <Waveform bars={20} className="mt-2 h-6" />
                </div>
                <button
                  type="button"
                  onClick={() => onCancel(item.clientId)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-coral-500 transition-colors hover:bg-coral-500/10"
                >
                  Cancel
                </button>
              </div>
            )}

            {status === 'completed' && (
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-500">
                  <FiCheckCircle size={18} />
                  Ready to download
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => onDownload(item.clientId)} className="btn-primary !px-4 !py-2 text-sm">
                    <FiDownload size={16} /> Download MP3
                  </button>
                  <button type="button" onClick={() => onReset(item.clientId)} className="btn-secondary !px-4 !py-2 text-sm">
                    <FiRefreshCw size={14} /> Convert again
                  </button>
                </div>
              </div>
            )}

            {status === 'cancelled' && (
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-ink-500 dark:text-mist-200/60">Conversion cancelled.</p>
                <button type="button" onClick={() => onReset(item.clientId)} className="btn-secondary !px-4 !py-2 text-sm">
                  <FiRefreshCw size={14} /> Try again
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-coral-500">
                  <FiAlertCircle size={18} />
                  {item.error || 'Something went wrong.'}
                </div>
                <button type="button" onClick={() => onReset(item.clientId)} className="btn-secondary !px-4 !py-2 text-sm">
                  <FiRefreshCw size={14} /> Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusRow({ circleProgress, label, sublabel }: { circleProgress: number; label: string; sublabel: string }) {
  return (
    <div className="flex items-center gap-4">
      <ProgressCircle progress={circleProgress} />
      <div>
        <p className="font-display text-sm font-semibold text-ink-800 dark:text-mist-100">{label}</p>
        <p className="text-xs text-ink-500 dark:text-mist-200/60">{sublabel}</p>
      </div>
    </div>
  );
}
