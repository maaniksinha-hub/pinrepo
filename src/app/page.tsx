import { Suspense } from "react";
import Link from "next/link";
import { Feed } from "@/components/Feed";
import { getAllRepos, getViralUpdatedAt } from "@/lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viral Git Repos for AI Coding (Updated Daily)",
  description:
    "See which git repositories are going viral today for Claude, Cursor, MCP, and AI agents. Fresh discoveries every day — pin your god-mode arsenal.",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Pinrepo — Viral git repos for AI coding",
    description:
      "Daily board of GitHub repositories going viral. Built for Claude, Cursor, and agent stacks.",
    type: "website",
  },
};

export default function HomePage() {
  const repos = getAllRepos();
  const viralUpdatedAt = getViralUpdatedAt();

  return (
    <>
      <Suspense fallback={<p className="boards__loading">Loading feed…</p>}>
        <Feed repos={repos} viralUpdatedAt={viralUpdatedAt} />
      </Suspense>
      <section className="home-seo">
        <h2>Git repositories that power AI coding tools</h2>
        <p>
          Pinrepo tracks <strong>viral git repositories</strong> and curated{" "}
          <strong>AI coding</strong> essentials for <strong>Claude</strong>,{" "}
          <strong>Cursor</strong>, and agent stacks. New discoveries are scanned
          from GitHub multiple times per day so you catch breakout repos while
          they&apos;re still climbing.
        </p>
        <p>
          Read the{" "}
          <Link href="/guides/best-git-repos-for-ai-coding">
            2026 guide to the best git repositories for AI coding
          </Link>{" "}
          or today&apos;s{" "}
          <Link href="/viral">viral GitHub digest</Link>. Subscribe via{" "}
          <Link href="/feed.xml">RSS</Link>.
        </p>
      </section>
    </>
  );
}
