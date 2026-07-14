import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiZap } from 'react-icons/fi';
import Waveform from './Waveform';

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">
              <FiZap size={14} /> Private, in-browser file conversion
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-ink-900 dark:text-white sm:text-5xl lg:text-6xl">
              Turn your MP4s into
              <span className="block gradient-text">crisp, ready MP3s.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base text-ink-600 dark:text-mist-200/70 sm:text-lg">
              Upload a video you own, pick your quality, and get a clean MP3 back in moments. No third-party links, no accounts, no clutter — just your files, converted and handed back to you.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/convert" className="btn-primary">
                Start Converting <FiArrowRight size={18} />
              </Link>
              <Link to="/features" className="btn-secondary">
                Explore Features
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-500 dark:text-mist-200/60">
              <span className="flex items-center gap-2">
                <FiShield size={16} className="text-violet-500 dark:text-cyan-300" /> Files auto-deleted after conversion
              </span>
              <span className="flex items-center gap-2">
                <FiZap size={16} className="text-violet-500 dark:text-cyan-300" /> Up to 320 kbps output
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="glass-card animate-float p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">vacation-highlights.mp4</p>
                  <p className="text-xs text-ink-500 dark:text-mist-200/60">128.4 MB • 4:32</p>
                </div>
                <span className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">320 kbps</span>
              </div>

              <Waveform bars={32} className="mt-8 h-24" />

              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs font-medium text-ink-500 dark:text-mist-200/60">Converting…</span>
                <span className="font-mono text-xs font-semibold text-violet-500 dark:text-cyan-300">76%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-900/10 dark:bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-brand-gradient"
                  initial={{ width: '0%' }}
                  animate={{ width: '76%' }}
                  transition={{ duration: 1.4, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 -top-4 hidden rounded-2xl bg-brand-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-glow-cyan sm:block"
            >
              vacation-highlights.mp3 ready
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
