import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Prose } from "@/components/Prose";
import { getPost, getPosts, formatDate } from "@/lib/content";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.summary,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <article className="container-page py-24">
      <Link
        href="/writing"
        className="group mb-12 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
        All writing
      </Link>

      <header className="mb-14 max-w-3xl">
        <time className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
          {formatDate(meta.date)}
        </time>
        <h1 className="mt-4 font-serif text-4xl font-light tracking-tight text-[var(--color-fg)] text-balance sm:text-5xl">
          {meta.title}
        </h1>
      </header>

      <Prose>
        <MDXRemote source={content} />
      </Prose>
    </article>
  );
}
