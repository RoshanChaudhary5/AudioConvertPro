import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  useEffect(() => {
    document.title = 'About — AudioConvert Pro';
  }, []);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="section-eyebrow">About</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
            About AudioConvert Pro
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card mt-12 p-8 sm:p-10"
        >
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Our project</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-mist-200/75">
            AudioConvert Pro is a focused tool for one job: turning a video file you already have into a
            clean MP3. We built it because most online converters are cluttered with ads, require sketchy
            downloads, or quietly pull media from platforms you don't own. AudioConvert Pro only ever
            processes files you explicitly upload from your own device.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-mist-200/75">
            Under the hood, conversion is powered by FFmpeg, an industry-standard open-source media
            toolkit, wrapped in a simple upload → convert → download flow.
          </p>
        </motion.div>

        <motion.div
          id="privacy"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="glass-card mt-6 scroll-mt-24 p-8 sm:p-10"
        >
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Privacy policy</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600 dark:text-mist-200/75">
            <p>
              <strong className="text-ink-800 dark:text-mist-100">What we collect:</strong> only the file
              you choose to upload, temporarily, for the sole purpose of converting it to MP3.
            </p>
            <p>
              <strong className="text-ink-800 dark:text-mist-100">How long we keep it:</strong> uploaded
              videos and converted audio are stored on our servers only long enough to complete the
              conversion and let you download the result, after which they are automatically deleted on a
              configurable schedule. You may also delete a file manually at any time.
            </p>
            <p>
              <strong className="text-ink-800 dark:text-mist-100">What we don't do:</strong> we do not sell
              or share your files, do not use them for training, and do not fetch or download media from
              third-party websites or platforms on your behalf.
            </p>
            <p>
              <strong className="text-ink-800 dark:text-mist-100">Analytics:</strong> we may collect basic,
              anonymized usage metrics (such as conversion counts) to improve reliability. We do not track
              you across other websites.
            </p>
          </div>
        </motion.div>

        <motion.div
          id="terms"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="glass-card mt-6 scroll-mt-24 p-8 sm:p-10"
        >
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Terms of use</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600 dark:text-mist-200/75">
            <p>
              <strong className="text-ink-800 dark:text-mist-100">Your responsibility:</strong> you may only
              upload files you own or have the legal right to convert. AudioConvert Pro is a tool for
              personal file conversion, not a mechanism to circumvent copyright.
            </p>
            <p>
              <strong className="text-ink-800 dark:text-mist-100">Service availability:</strong> the service
              is provided "as is" without warranty of any kind. We aim for high reliability but cannot
              guarantee uninterrupted availability.
            </p>
            <p>
              <strong className="text-ink-800 dark:text-mist-100">Fair use:</strong> automated abuse,
              excessive load, or attempts to bypass upload limits and rate limiting may result in access
              being restricted.
            </p>
            <p>
              <strong className="text-ink-800 dark:text-mist-100">Changes:</strong> these terms may be
              updated from time to time; continued use of the service constitutes acceptance of the current
              terms.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
