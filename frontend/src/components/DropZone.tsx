import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUploadCloud } from 'react-icons/fi';
import { MAX_UPLOAD_SIZE_MB } from '../utils/validators';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  multiple?: boolean;
}

export default function DropZone({ onFilesAdded, multiple = true }: DropZoneProps) {

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple,
    accept: { 'video/mp4': ['.mp4'] },
  });

  return (
    <div
      {...getRootProps()}
      className={`group relative cursor-pointer rounded-4xl border-2 border-dashed p-10 text-center transition-all duration-300 sm:p-14 ${
        isDragActive && !isDragReject
          ? 'border-violet-400 bg-violet-400/10 scale-[1.01]'
          : isDragReject
          ? 'border-coral-500 bg-coral-500/5'
          : 'border-ink-900/15 bg-white/40 hover:border-violet-400/50 hover:bg-white/60 dark:border-white/15 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]'
      }`}
      role="button"
      tabIndex={0}
      aria-label="Upload MP4 files by dragging and dropping, or click to browse"
    >
      <input {...getInputProps()} />

      <motion.div
        animate={isDragActive ? { y: -6, scale: 1.05 } : { y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-glow-violet"
      >
        <FiUploadCloud size={32} />
      </motion.div>

      <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-white sm:text-2xl">
        {isDragActive ? 'Drop your MP4 files here' : 'Drag & drop your MP4 files'}
      </h3>
      <p className="mt-2 text-sm text-ink-600 dark:text-mist-200/70">
        or <span className="font-semibold text-violet-500 dark:text-cyan-300">browse from your device</span> — up to {MAX_UPLOAD_SIZE_MB} MB per file
      </p>
      <p className="mt-4 text-xs text-ink-500 dark:text-mist-200/50">
        Your files are processed privately and removed automatically after conversion.
      </p>
    </div>
  );
}
