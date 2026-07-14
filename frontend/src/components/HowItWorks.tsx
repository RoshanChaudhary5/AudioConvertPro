import { motion } from 'framer-motion';
import { FiUpload, FiSliders, FiDownload } from 'react-icons/fi';

const steps = [
  {
    number: '01',
    icon: FiUpload,
    title: 'Upload your MP4',
    description: 'Drag a video into the upload zone or select it from your device. Only files you choose are ever touched.',
  },
  {
    number: '02',
    icon: FiSliders,
    title: 'Pick your quality',
    description: 'Choose an output bitrate from 128 to 320 kbps depending on how you plan to use the audio.',
  },
  {
    number: '03',
    icon: FiDownload,
    title: 'Download your MP3',
    description: 'Watch the live progress bar, then download your finished MP3 in a single click.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Simple by design</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
            Three steps from video to audio
          </h2>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent md:block" />
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow-violet">
                <step.icon size={26} />
              </div>
              <span className="mt-4 font-mono text-xs font-semibold text-violet-500 dark:text-cyan-300">
                STEP {step.number}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-ink-600 dark:text-mist-200/65">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
