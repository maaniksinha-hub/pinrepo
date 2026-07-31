import { Suspense } from "react";
import Link from "next/link";
import { Feed } from "@/components/Feed";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Git Repositories for AI Coding (Claude, Cursor, MCP)",
  description:
    "Browse top, newest, and popular git repositories for AI coding tools. Pin Claude, Cursor, MCP, and agent repos to boards.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<p className="boards__loading">Loading feed…</p>}>
        <Feed />
      </Suspense>
      <section className="home-seo">
        <h2>Git repositories that power AI coding tools</h2>
        <p>
          Pinrepo is a discovery board for <strong>git</strong> and{" "}
          <strong>AI</strong> developers: the open-source projects that make{" "}
          <strong>Claude</strong>, <strong>Cursor</strong>, and agent stacks
          dramatically more capable. Explore Model Context Protocol servers,
          Claude Code, Cursor rules, LangChain, browser-use, and more — then pin
          them into boards you actually reuse.
        </p>
        <p>
          Read the{" "}
          <Link href="/guides/best-git-repos-for-ai-coding">
            2026 guide to the best git repositories for AI coding
          </Link>
          .
        </p>
      </section>
    </>
  );
}
