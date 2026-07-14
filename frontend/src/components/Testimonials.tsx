import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Maya R.',
    role: 'Podcast Editor',
    quote:
      'I pull audio from raw video interviews constantly. This is the fastest, cleanest tool I have used for it — no clutter, just the conversion.',
  },
  {
    name: 'Daniel K.',
    role: 'Independent Musician',
    quote:
      'The quality options are exactly what I need. 320 kbps output sounds identical to the source video audio.',
  },
  {
    name: 'Priya S.',
    role: 'Content Creator',
    quote:
      'Batch converting a whole folder of clips used to be a headache. Now I queue them up and walk away.',
  },
];

export default function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Loved by creators</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
            What people are saying
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card flex flex-col p-6"
            >
              <div className="flex gap-1 text-cyan-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FiStar key={idx} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-700 dark:text-mist-200/80">“{t.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient font-display text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-ink-500 dark:text-mist-200/60">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
