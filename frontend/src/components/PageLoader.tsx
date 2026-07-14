export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-end gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-brand-gradient animate-wave"
            style={{ height: '28px', animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
