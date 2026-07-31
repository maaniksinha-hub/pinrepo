import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { REPOS, formatStars, repoSlug } from "@/data/repos";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return REPOS.map((repo) => ({ slug: repoSlug(repo) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const repo = REPOS.find((r) => repoSlug(r) === slug);
  if (!repo) return { title: "Repository not found" };

  const title = `${repo.owner}/${repo.name} — AI git repository for Claude & Cursor`;
  const description = `${repo.description} God mode: ${repo.godMode} ★ ${formatStars(repo.stars)} · ${repo.language}.`;

  return {
    title,
    description,
    keywords: [
      repo.name,
      repo.owner,
      ...repo.topics,
      "git repository",
      "AI coding",
      "Claude",
      "Cursor",
      "GitHub",
    ],
    alternates: { canonical: `/repo/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/repo/${slug}`,
      type: "article",
      images: [{ url: repo.cover, alt: `${repo.owner}/${repo.name} ink cover` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [repo.cover],
    },
  };
}

export default async function RepoPage({ params }: Props) {
  const { slug } = await params;
  const repo = REPOS.find((r) => repoSlug(r) === slug);
  if (!repo) notFound();

  const github = `https://github.com/${repo.owner}/${repo.name}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: `${repo.owner}/${repo.name}`,
    description: repo.description,
    url: `${SITE_URL}/repo/${slug}`,
    codeRepository: github,
    programmingLanguage: repo.language,
    image: `${SITE_URL}${repo.cover}`,
    keywords: repo.topics.join(", "),
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: repo.stars,
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const related = REPOS.filter(
    (r) =>
      r.id !== repo.id &&
      (r.topics.some((t) => repo.topics.includes(t)) ||
        r.language === repo.language),
  ).slice(0, 4);

  return (
    <article className="repo-page">
      <JsonLd data={ld} />
      <nav className="repo-page__crumbs" aria-label="Breadcrumb">
        <Link href="/">Pinrepo</Link>
        <span aria-hidden="true"> / </span>
        <span>{repo.owner}/{repo.name}</span>
      </nav>

      <div className="repo-page__hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="repo-page__cover"
          src={repo.cover}
          alt={`Black and white ink sketch cover for ${repo.owner}/${repo.name}`}
          width={1000}
          height={750}
        />
        <div className="repo-page__intro">
          <p className="repo-page__owner">{repo.owner}/</p>
          <h1 className="repo-page__title">{repo.name}</h1>
          <p className="repo-page__desc">{repo.description}</p>
          <p className="repo-page__god">
            <span>God mode</span> {repo.godMode}
          </p>
          <p className="repo-page__meta">
            {repo.language} · ★ {formatStars(repo.stars)} stars ·{" "}
            {repo.topics.join(", ")}
          </p>
          <div className="repo-page__actions">
            <a
              className="repo-page__github"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on GitHub
            </a>
            <Link className="repo-page__back" href="/">
              Back to feed
            </Link>
          </div>
        </div>
      </div>

      <section className="repo-page__why">
        <h2>Why this git repository matters for AI coding</h2>
        <p>
          Developers searching for the best <strong>git repositories for AI</strong>{" "}
          tools like <strong>Claude</strong>, <strong>Cursor</strong>, and agent
          stacks use Pinrepo to find high-leverage projects.{" "}
          <strong>
            {repo.owner}/{repo.name}
          </strong>{" "}
          stands out for {repo.topics.join(", ")} workflows
          {repo.language ? ` in ${repo.language}` : ""}.
        </p>
        <p>{repo.godMode}</p>
      </section>

      {related.length > 0 && (
        <section className="repo-page__related">
          <h2>Related AI git repositories</h2>
          <ul>
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/repo/${repoSlug(r)}`}>
                  {r.owner}/{r.name}
                </Link>
                <span> — {r.godMode}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
