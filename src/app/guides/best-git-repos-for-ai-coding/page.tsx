import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { REPOS, formatStars, repoSlug } from "@/data/repos";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Best Git Repositories for AI Coding (Claude, Cursor, MCP) — 2026 Guide",
  description:
    "A practical guide to the best open-source git repositories for AI coding: Claude Code, Cursor rules, MCP servers, AI agents, RAG, and browser automation. Updated for 2026.",
  keywords: [
    "best git repositories for AI",
    "AI coding tools",
    "Claude Code repos",
    "Cursor IDE repositories",
    "MCP servers list",
    "GitHub AI agents",
    "open source AI developer tools",
  ],
  alternates: {
    canonical: "/guides/best-git-repos-for-ai-coding",
  },
  openGraph: {
    title: "Best Git Repositories for AI Coding — 2026 Guide",
    description:
      "Curated git repos that unlock Claude, Cursor, and agent god mode.",
    url: `${SITE_URL}/guides/best-git-repos-for-ai-coding`,
    type: "article",
  },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Git Repositories for AI Coding (Claude, Cursor, MCP)",
  description:
    "Guide to top open-source git repositories for AI-assisted software development.",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  datePublished: "2026-07-30",
  dateModified: "2026-07-30",
  mainEntityOfPage: `${SITE_URL}/guides/best-git-repos-for-ai-coding`,
};

export default function GuidePage() {
  const top = [...REPOS].sort((a, b) => b.stars - a.stars).slice(0, 8);

  return (
    <article className="guide">
      <JsonLd data={articleLd} />
      <header className="guide__hero">
        <h1>Best git repositories for AI coding in 2026</h1>
        <p>
          If you use <strong>Claude</strong>, <strong>Cursor</strong>, or other
          AI coding tools, the right <strong>git repositories</strong> matter as
          much as the model. This guide highlights open-source projects —
          MCP servers, agent runtimes, rules packs, RAG, and browser automation —
          that turn an AI assistant into a full god-mode workflow.
        </p>
      </header>

      <section className="guide__section">
        <h2>What “AI god mode” means for git</h2>
        <p>
          God mode is not a single repo. It is a stack: an editor agent (Cursor /
          Continue), a terminal agent (Claude Code / Aider), tool connectors
          (Model Context Protocol), memory/RAG, and optional browser control.
          Pinrepo curates those pieces so you can pin an arsenal instead of
          doom-scrolling GitHub stars.
        </p>
      </section>

      <section className="guide__section">
        <h2>Top AI git repositories to start with</h2>
        <ol className="guide__list">
          {top.map((repo) => (
            <li key={repo.id}>
              <h3>
                <Link href={`/repo/${repoSlug(repo)}`}>
                  {repo.owner}/{repo.name}
                </Link>
              </h3>
              <p>{repo.description}</p>
              <p>
                <strong>God mode:</strong> {repo.godMode} · ★{" "}
                {formatStars(repo.stars)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="guide__section">
        <h2>How to choose repos for Claude and Cursor</h2>
        <ul>
          <li>
            <strong>MCP first</strong> — without tools, the model can only talk.
            Start with official MCP servers and Playwright MCP.
          </li>
          <li>
            <strong>Rules and skills</strong> — awesome-cursorrules and Claude
            Agent Skills encode team taste so every session starts strong.
          </li>
          <li>
            <strong>Agents for long jobs</strong> — OpenHands, CrewAI, and
            AutoGen handle multi-step work beyond a single chat turn.
          </li>
          <li>
            <strong>Memory and RAG</strong> — mem0 and LlamaIndex keep project
            context from evaporating between sessions.
          </li>
        </ul>
      </section>

      <p className="guide__cta">
        <Link href="/">Browse the full Pinrepo feed</Link> — sort Top, Newest,
        or Popular and pin boards for your stack.
      </p>
    </article>
  );
}
