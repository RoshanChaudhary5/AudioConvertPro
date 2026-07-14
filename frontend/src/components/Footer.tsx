import { Link } from 'react-router-dom';
import { HiOutlineMusicalNote } from 'react-icons/hi2';
import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900 dark:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-white">
                <HiOutlineMusicalNote size={18} />
              </span>
              AudioConvert<span className="gradient-text">Pro</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-600 dark:text-mist-200/70">
              Convert your own MP4 videos into high-quality MP3 audio, entirely from files you upload — fast, private, and free.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: FiGithub, label: 'GitHub', href: '#' },
                { icon: FiTwitter, label: 'Twitter', href: '#' },
                { icon: FiMail, label: 'Email', href: 'mailto:hello@audioconvertpro.app' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full glass-panel text-ink-700 transition-colors hover:text-violet-500 dark:text-mist-200 dark:hover:text-cyan-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: 'Convert', to: '/convert' },
              { label: 'Features', to: '/features' },
              { label: 'How it Works', to: '/#how-it-works' },
              { label: 'FAQ', to: '/#faq' },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: 'About', to: '/about' },
              { label: 'Privacy Policy', to: '/about#privacy' },
              { label: 'Terms of Use', to: '/about#terms' },
            ]}
          />
          <FooterCol
            title="Supported Formats"
            links={[
              { label: 'MP4 → MP3', to: '/convert' },
              { label: '128 – 320 kbps', to: '/features' },
              { label: 'Batch Conversion', to: '/features' },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-ink-500 dark:text-mist-200/60 sm:flex-row">
          <p>© {year} AudioConvert Pro. All rights reserved.</p>
          <p>Built with care for people who own their files.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-900 dark:text-mist-100">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-ink-600 transition-colors hover:text-violet-500 dark:text-mist-200/70 dark:hover:text-cyan-300">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
