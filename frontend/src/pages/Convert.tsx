import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';
import DropZone from '../components/DropZone';
import FileCard from '../components/FileCard';
import EmptyState from '../components/EmptyState';
import { useConversion } from '../hooks/useConversion';

export default function Convert() {
  const {
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
  } = useConversion();

  useEffect(() => {
    document.title = 'Convert MP4 to MP3 — AudioConvert Pro';
  }, []);

  const idleCount = queue.filter((q) => q.status === 'idle').length;

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="section-eyebrow">Convert</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
            Convert your MP4 to MP3
          </h1>
          <p className="mt-3 text-ink-600 dark:text-mist-200/70">
            Upload one or more videos, choose your quality, and download clean audio in seconds.
          </p>
        </div>

        <div className="mt-10">
          <DropZone onFilesAdded={addFiles} multiple />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-mist-200/60">
            Your Files {queue.length > 0 && `(${queue.length})`}
          </h2>
          {queue.length > 0 && (
            <div className="flex gap-2">
              {idleCount > 1 && (
                <button type="button" onClick={convertAll} className="btn-secondary !px-4 !py-1.5 text-xs">
                  Convert All ({idleCount})
                </button>
              )}
              <button
                type="button"
                onClick={clearQueue}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-500 transition-colors hover:bg-coral-500/10 hover:text-coral-500 dark:text-mist-200/60"
              >
                <FiTrash2 size={13} /> Clear all
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {queue.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="popLayout">
              {queue.map((item) => (
                <FileCard
                  key={item.clientId}
                  item={item}
                  onConvert={convertItem}
                  onCancel={cancelItem}
                  onDownload={downloadItem}
                  onRemove={removeItem}
                  onReset={resetItem}
                  onBitrateChange={setBitrate}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center text-xs text-ink-400 dark:text-mist-200/40"
        >
          Files are processed on our server and deleted automatically after a short retention window.
        </motion.p>
      </div>
    </section>
  );
}
