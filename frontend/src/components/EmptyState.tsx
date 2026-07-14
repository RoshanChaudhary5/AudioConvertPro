import { FiFileText } from 'react-icons/fi';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'No files yet',
  description = 'Upload an MP4 video above to get started. Converted MP3s will appear here.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-900/10 py-14 text-center dark:border-white/10">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900/5 text-ink-400 dark:bg-white/5 dark:text-mist-200/50">
        <FiFileText size={24} />
      </div>
      <h3 className="font-display text-base font-semibold text-ink-800 dark:text-mist-100">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-ink-500 dark:text-mist-200/60">{description}</p>
    </div>
  );
}
