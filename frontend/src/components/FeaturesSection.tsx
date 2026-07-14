import { motion } from 'framer-motion';
import {
  FiUploadCloud,
  FiSliders,
  FiLayers,
  FiShieldOff,
  FiXCircle,
  FiBell,
} from 'react-icons/fi';

const features = [
  {
    icon: FiUploadCloud,
    title: 'Drag & Drop Upload',
    description: 'Drop files straight from your desktop, or browse to pick them — instant, no friction.',
  },
  {
    icon: FiSliders,
    title: 'Choose Your Quality',
    description: 'Select 128, 192, 256, or 320 kbps output to balance file size and fidelity.',
  },
  {
    icon: FiLayers,
    title: 'Batch Conversion',
    description: 'Queue up multiple MP4s and convert them all in one sitting, each tracked individually.',
  },
  {
    icon: FiXCircle,
    title: 'Cancel Anytime',
    description: 'Change your mind mid-conversion? Cancel a job instantly with a single click.',
  },
  {
    icon: FiShieldOff,
    title: 'Automatic Cleanup',
    description: 'Uploaded and converted files are wiped from our servers automatically after a short window.',
  },
  {
    icon: FiBell,
    title: 'Live Status Updates',
    description: 'Clear progress indicators and toast notifications keep you informed at every step.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Everything you need</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
            Built for a fast, focused conversion workflow
          </h2>
          <p className="mt-4 text-ink-600 dark:text-mist-200/70">
            No unnecessary steps. Just the tools that get your audio out of your video, quickly and reliably.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass-card group p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow-violet transition-transform duration-300 group-hover:scale-110">
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
