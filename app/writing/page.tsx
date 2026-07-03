import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getPosts, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on building reliable AI systems and thoughtful software.",
};

export default function WritingPage() {
  const posts = getPosts();

  return (
    <div className="container-page py-28">
      <Reveal className="mb-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Writing
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-[var(--color-fg)]">
          Notes &amp; write-ups
        </h1>
      </Reveal>

      <ul className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
        {posts.map((post, i) => (
          <Reveal key={post.slug} as="li" delay={i * 0.05}>
            <Link
              href={`/writing/${post.slug}`}
              className="group flex flex-col gap-2 py-8 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="max-w-2xl">
                <h2 className="font-serif text-xl font-light text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
                  {post.title}
                </h2>
                <p className="mt-2 text-[15px] leading-6 text-[var(--color-muted)] text-pretty">
                  {post.summary}
                </p>
              </div>
              <time className="shrink-0 font-mono text-xs text-[var(--color-faint)]">
                {formatDate(post.date)}
              </time>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
