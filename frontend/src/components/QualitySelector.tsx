import { Bitrate } from '../services/api';

interface QualitySelectorProps {
  value: Bitrate;
  onChange: (bitrate: Bitrate) => void;
  disabled?: boolean;
}

const OPTIONS: { value: Bitrate; label: string; description: string }[] = [
  { value: '128', label: '128 kbps', description: 'Smaller file' },
  { value: '192', label: '192 kbps', description: 'Balanced' },
  { value: '256', label: '256 kbps', description: 'High quality' },
  { value: '320', label: '320 kbps', description: 'Best quality' },
];

export default function QualitySelector({ value, onChange, disabled }: QualitySelectorProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-mist-200/60">
        Audio Quality
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {OPTIONS.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={`rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                active
                  ? 'border-transparent bg-brand-gradient text-white shadow-glow-violet'
                  : 'border-ink-900/10 bg-white/50 text-ink-800 hover:border-violet-400/50 dark:border-white/10 dark:bg-white/[0.03] dark:text-mist-100'
              } disabled:opacity-50`}
            >
              <div className="font-display text-sm font-semibold">{opt.label}</div>
              <div className={`text-[11px] ${active ? 'text-white/80' : 'text-ink-500 dark:text-mist-200/60'}`}>
                {opt.description}
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
