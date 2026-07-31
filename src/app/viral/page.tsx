import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { formatStars, repoSlug } from "@/data/repos";
import { getViralRepos, getViralUpdatedAt } from "@/lib/catalog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Viral GitHub Repositories Today — AI & Developer Breakouts",
  description:
    "Daily digest of git repositories going viral on GitHub. Catch breakout AI, MCP, Claude, and Cursor projects before everyone else.",
  alternates: { canonical: "/viral" },
  openGraph: {
    title: "Viral GitHub repos today | Pinrepo",
    description:
      "Fresh list of repositories surging in stars — updated automatically from GitHub.",
    type: "article",
    url: `${SITE_URL}/viral`,
  },
};

export default function ViralDigestPage() {
  const viral = getViralRepos().slice(0, 40);
  const updatedAt = getViralUpdatedAt();
  const day = new Date(updatedAt).toISOString().slice(0, 10);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: `Viral GitHub repositories — ${day}`,
    datePublished: updatedAt,
    dateModified: updatedAt,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/viral`,
    description:
      "Automatically updated digest of git repositories going viral on GitHub.",
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Viral git repos ${day}`,
    numberOfItems: viral.length,
    itemListElement: viral.map((repo, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/repo/${repoSlug(repo)}`,
      name: `${repo.owner}/${repo.name}`,
    })),
  };

  return (
    <article className="guide">
      <JsonLd data={articleLd} />
      <JsonLd data={itemListLd} />
      <header className="guide__hero">
        <h1>Viral git repositories today</h1>
        <p>
          Automatically scanned from GitHub for repos gaining stars fast —
          especially AI, MCP, Claude, and Cursor tooling. Updated{" "}
          <time dateTime={updatedAt}>{new Date(updatedAt).toUTCString()}</time>.
        </p>
      </header>

      <section className="guide__section">
        <h2>Breakouts right now</h2>
        {viral.length === 0 ? (
          <p>Scanner hasn&apos;t found fresh viral repos yet. Check back soon.</p>
        ) : (
          <ol className="guide__list">
            {viral.map((repo) => (
              <li key={repo.id}>
                <h3>
                  <Link href={`/repo/${repoSlug(repo)}`}>
                    {repo.owner}/{repo.name}
                  </Link>
                </h3>
                <p>{repo.description}</p>
                <p>
                  <strong>★ {formatStars(repo.stars)}</strong>
                  {repo.language ? ` · ${repo.language}` : ""} ·{" "}
                  {repo.godMode}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <p className="guide__cta">
        <Link href="/?sort=viral">Open the Viral feed</Link> ·{" "}
        <Link href="/feed.xml">RSS feed</Link> ·{" "}
        <Link href="/guides/best-git-repos-for-ai-coding">AI repos guide</Link>
      </p>
    </article>
  );
}
