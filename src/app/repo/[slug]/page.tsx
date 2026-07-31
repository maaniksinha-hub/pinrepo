import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { formatStars, repoSlug } from "@/data/repos";
import { findRepoBySlug, getAllRepos } from "@/lib/catalog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllRepos().map((repo) => ({ slug: repoSlug(repo) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const repo = findRepoBySlug(slug);
  if (!repo) return { title: "Repository not found" };

  const viralPrefix = repo.viral ? "Viral: " : "";
  const title = `${viralPrefix}${repo.owner}/${repo.name} — git repo for AI coding`;
  const description = `${repo.description} ${repo.godMode} ★ ${formatStars(repo.stars)} · ${repo.language}.`;

  return {
    title,
    description,
    keywords: [
      repo.name,
      repo.owner,
      ...repo.topics,
      "viral github",
      "git repository",
      "AI coding",
      "Claude",
      "Cursor",
      "GitHub trending",
    ],
    alternates: { canonical: `/repo/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/repo/${slug}`,
      type: "article",
      images: [{ url: repo.cover, alt: `${repo.owner}/${repo.name} cover` }],
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
  const repo = findRepoBySlug(slug);
  if (!repo) notFound();

  const github =
    repo.htmlUrl || `https://github.com/${repo.owner}/${repo.name}`;
  const all = getAllRepos();
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
    dateModified: new Date(repo.updatedAt).toISOString(),
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

  const related = all
    .filter(
      (r) =>
        r.id !== repo.id &&
        (r.topics.some((t) => repo.topics.includes(t)) ||
          r.language === repo.language ||
          (!!repo.viral && !!r.viral)),
    )
    .slice(0, 4);

  const shareText = encodeURIComponent(
    `${repo.owner}/${repo.name} is ${repo.viral ? "going viral" : "essential"} for AI coding — ★${formatStars(repo.stars)} on Pinrepo`,
  );
  const shareUrl = encodeURIComponent(`${SITE_URL}/repo/${slug}`);

  return (
    <article className="repo-page">
      <JsonLd data={ld} />
      <nav className="repo-page__crumbs" aria-label="Breadcrumb">
        <Link href="/">Pinrepo</Link>
        <span aria-hidden="true"> / </span>
        <span>
          {repo.owner}/{repo.name}
        </span>
      </nav>

      <div className="repo-page__hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="repo-page__cover"
          src={repo.cover}
          alt={`Cover for ${repo.owner}/${repo.name}`}
          width={1200}
          height={400}
        />
        <div className="repo-page__intro">
          {repo.viral && <p className="repo-page__badge">VIRAL ON GITHUB</p>}
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
            <a
              className="repo-page__back"
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share
            </a>
            <Link className="repo-page__back" href="/viral">
              Viral digest
            </Link>
          </div>
        </div>
      </div>

      <section className="repo-page__why">
        <h2>
          {repo.viral
            ? "Why this git repository is going viral"
            : "Why this git repository matters for AI coding"}
        </h2>
        <p>
          Developers hunting <strong>viral GitHub repositories</strong> and the
          best <strong>git repos for AI</strong> tools like{" "}
          <strong>Claude</strong> and <strong>Cursor</strong> use Pinrepo to
          spot breakouts early.{" "}
          <strong>
            {repo.owner}/{repo.name}
          </strong>{" "}
          stands out for {repo.topics.join(", ") || "developer"} workflows
          {repo.language ? ` in ${repo.language}` : ""}.
        </p>
        <p>{repo.godMode}</p>
      </section>

      {related.length > 0 && (
        <section className="repo-page__related">
          <h2>Related repositories</h2>
          <ul>
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/repo/${repoSlug(r)}`}>
                  {r.owner}/{r.name}
                </Link>
                <span>
                  {" "}
                  — {r.viral ? "viral · " : ""}
                  {r.godMode}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
