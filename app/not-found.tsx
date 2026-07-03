import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-start justify-center py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
        404
      </p>
      <h1 className="mt-4 font-serif text-4xl font-light text-[var(--color-fg)] sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-[var(--color-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent)]"
      >
        Back home
      </Link>
    </div>
  );
}
