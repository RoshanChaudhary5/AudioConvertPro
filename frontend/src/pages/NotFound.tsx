import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Waveform from '../components/Waveform';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found — AudioConvert Pro';
  }, []);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Waveform bars={18} className="h-14" active={false} />
      <h1 className="mt-8 font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
        404 — Page not found
      </h1>
      <p className="mt-3 max-w-sm text-ink-600 dark:text-mist-200/70">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <FiArrowLeft size={18} /> Back to home
      </Link>
    </section>
  );
}
