import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { HiOutlineMusicalNote } from 'react-icons/hi2';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Home' },
  { to: '/convert', label: 'Convert' },
  { to: '/features', label: 'Features' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-violet-500 dark:text-cyan-300' : 'text-ink-700 dark:text-mist-200 hover:text-violet-500 dark:hover:text-cyan-300'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className={`glass-panel flex items-center justify-between rounded-full px-4 py-2.5 transition-shadow ${
            scrolled ? 'shadow-glow-violet/10' : ''
          }`}
          aria-label="Primary"
        >
          <Link to="/" className="flex items-center gap-2 pl-1 font-display text-lg font-bold text-ink-900 dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow-violet">
              <HiOutlineMusicalNote size={18} />
            </span>
            <span>
              AudioConvert<span className="gradient-text">Pro</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link to="/convert" className="btn-primary !px-5 !py-2 text-sm">
              Get Started
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full glass-panel text-ink-900 dark:text-mist-100"
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-2 overflow-hidden md:hidden"
            >
              <div className="glass-card flex flex-col gap-1 p-3">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-gradient text-white'
                          : 'text-ink-700 dark:text-mist-200 hover:bg-white/40 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link to="/convert" className="btn-primary mt-1 justify-center">
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
