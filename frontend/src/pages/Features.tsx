import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUploadCloud,
  FiSliders,
  FiLayers,
  FiShieldOff,
  FiXCircle,
  FiBell,
  FiTag,
  FiSmartphone,
  FiMoon,
  FiAlertTriangle,
  FiClock,
  FiLock,
} from 'react-icons/fi';

const allFeatures = [
  { icon: FiUploadCloud, title: 'Drag & Drop Upload', description: 'Drop files directly onto the page or use the file picker to browse.' },
  { icon: FiLayers, title: 'Multiple File Uploads', description: 'Select or drop several MP4s at once to build a conversion queue.' },
  { icon: FiClock, title: 'Conversion Queue', description: 'Each file converts independently with its own live progress.' },
  { icon: FiSliders, title: 'Quality Selection', description: 'Choose 128, 192, 256, or 320 kbps output for every file.' },
  { icon: FiTag, title: 'Metadata Editing', description: 'Optionally set title, artist, and album tags on your MP3 output.' },
  { icon: FiXCircle, title: 'Cancel Conversion', description: 'Stop an in-progress conversion instantly if you change your mind.' },
  { icon: FiShieldOff, title: 'Automatic Cleanup', description: 'Uploaded and converted files are deleted from our servers automatically.' },
  { icon: FiAlertTriangle, title: 'Robust Error Handling', description: 'Clear, actionable messages if a file is invalid or a conversion fails.' },
  { icon: FiBell, title: 'Success Notifications', description: 'Toast notifications confirm uploads, completions, and errors as they happen.' },
  { icon: FiMoon, title: 'Dark & Light Mode', description: 'A refined interface in both themes, matching your system preference by default.' },
  { icon: FiSmartphone, title: 'Mobile-Friendly', description: 'A fully responsive layout that works great on phones and tablets.' },
  { icon: FiLock, title: 'Privacy-Minded', description: 'We never touch third-party platforms — only files you upload yourself.' },
];

export default function Features() {
  useEffect(() => {
    document.title = 'Features — AudioConvert Pro';
  }, []);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Full feature list</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
            Everything AudioConvert Pro can do
          </h1>
          <p className="mt-4 text-ink-600 dark:text-mist-200/70">
            A complete, focused toolkit for turning your own video files into clean MP3 audio.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                <feature.icon size={20} />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-ink-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink-600 dark:text-mist-200/65">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
