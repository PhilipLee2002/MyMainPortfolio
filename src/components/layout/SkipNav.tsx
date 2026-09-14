export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[9999]
        px-4 py-2 rounded
        bg-[var(--accent)] text-[var(--bg)]
        font-semibold text-sm
        focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
      "
    >
      Skip to main content
    </a>
  );
}
