import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import Waveform from './Waveform';

const bullets = ['No account required', 'Files auto-deleted after conversion', 'Up to 320 kbps output'];

export default function UploadSection() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="glass-card relative overflow-hidden px-6 py-12 sm:px-14 sm:py-16"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
                Ready when you are.
              </h2>
              <p className="mt-4 text-ink-600 dark:text-mist-200/70">
                Head to the Convert page to upload your MP4, choose a quality, and get your MP3 in moments.
              </p>
              <ul className="mt-6 space-y-2.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-ink-700 dark:text-mist-200/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient text-white">
                      <FiCheck size={12} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link to="/convert" className="btn-primary mt-8">
                Go to Converter <FiArrowRight size={18} />
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <Waveform bars={28} className="h-32 w-full max-w-sm" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
