import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: 'Do you download videos from YouTube or other platforms?',
    answer:
      'No. AudioConvert Pro only converts files that you upload yourself from your device. We never fetch or extract media from third-party websites or platforms.',
  },
  {
    question: 'How long do you keep my files?',
    answer:
      'Uploaded videos and converted MP3s are stored temporarily and automatically deleted from our servers after a short retention window. You can also delete a file manually at any time.',
  },
  {
    question: 'What audio quality options are available?',
    answer:
      'You can choose from 128, 192, 256, or 320 kbps when converting. Higher bitrates preserve more detail at the cost of a larger file size.',
  },
  {
    question: 'Is there a file size limit?',
    answer:
      'Yes, uploads are limited to 500 MB per file by default. This keeps conversions fast and reliable for everyone.',
  },
  {
    question: 'Can I convert multiple files at once?',
    answer:
      'Yes. You can queue up several MP4 files and convert them together — each file shows its own independent progress.',
  },
  {
    question: 'Is AudioConvert Pro free to use?',
    answer:
      'Yes, converting your own files is free. We may introduce optional paid tiers in the future for higher limits, but core conversion stays free.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="section-eyebrow">Questions</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.question} className="glass-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-sm font-semibold text-ink-900 dark:text-white sm:text-base">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900/5 text-ink-600 dark:bg-white/10 dark:text-mist-200"
                  >
                    <FiChevronDown size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink-600 dark:text-mist-200/70">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
