import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-mist-50 dark:bg-ink-950 transition-colors duration-300">
      {/* Ambient background gradient, fixed behind all content */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-aurora-gradient dark:opacity-100 opacity-60" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-noise" aria-hidden="true" />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-gradient focus:px-5 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
