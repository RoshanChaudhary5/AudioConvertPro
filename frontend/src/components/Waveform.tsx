interface WaveformProps {
  bars?: number;
  active?: boolean;
  className?: string;
}

/**
 * The signature visual motif of the app: an audio waveform rendered as
 * animated bars. Used in the hero, upload states, and conversion progress
 * to consistently reinforce the "audio" subject matter.
 */
export default function Waveform({ bars = 24, active = true, className = '' }: WaveformProps) {
  const heights = Array.from({ length: bars }, (_, i) => {
    // Deterministic pseudo-random pattern so it looks organic but is stable across renders
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    return 20 + (Math.abs(seed % 1) * 80);
  });

  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-1 rounded-full bg-brand-gradient ${active ? 'animate-wave' : ''}`}
          style={{
            height: `${h}%`,
            animationDelay: `${(i % 8) * 0.09}s`,
            animationDuration: `${0.9 + (i % 5) * 0.12}s`,
            opacity: active ? 1 : 0.35,
          }}
        />
      ))}
    </div>
  );
}
