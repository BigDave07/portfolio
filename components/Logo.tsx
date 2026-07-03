/**
 * "DO" monogram for David Oladipupo.
 * Monoline geometric letterforms: D in the current text color, O in the brand accent.
 * Font-independent (pure paths) so it stays crisp at every size, incl. favicon.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 96"
      fill="none"
      role="img"
      aria-label="David Oladipupo"
      className={className}
    >
      {/* D */}
      <path
        d="M34 24 L34 72 M34 24 C 74 24 74 72 34 72"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* O */}
      <circle cx="86" cy="48" r="20" stroke="var(--color-accent)" strokeWidth="9" />
    </svg>
  );
}
