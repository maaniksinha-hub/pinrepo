import type { Metadata } from "next";
import { BoardsProvider } from "@/hooks/useBoards";
import { Nav } from "@/components/Nav";
import { ScreentoneDefs } from "@/components/ScreentoneDefs";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { REPOS, formatStars, repoSlug } from "@/data/repos";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Best Git Repositories for AI Coding (Claude, Cursor, MCP)`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Discover the top, newest, and most popular git repositories for AI coding tools. Curated MCP servers, Claude Code, Cursor rules, agents, RAG, and browser automation — pin your god-mode arsenal.",
  keywords: [
    "git repositories",
    "AI coding",
    "Claude Code",
    "Cursor IDE",
    "MCP servers",
    "AI agents",
    "GitHub trending AI",
    "best repos for Cursor",
    "best repos for Claude",
    "Model Context Protocol",
    "AI developer tools",
    "agentic coding",
    "open source AI",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Top / newest / popular git repos that power Claude, Cursor, and AI agents. Browse, pin, and build your arsenal.",
    locale: "en_US",
    images: [
      {
        url: "/covers/mcp-servers.webp",
        width: 1000,
        height: 750,
        alt: "Pinrepo — AI git repository covers in ink sketch style",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Best git repos for AI coding`,
    description:
      "Curated git repositories for Claude, Cursor, MCP, and agent stacks. Top, newest, popular.",
    images: ["/covers/mcp-servers.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_TAGLINE,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_TAGLINE,
};

const itemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best git repositories for AI coding tools",
  itemListOrder: "https://schema.org/ItemListOrderDescending",
  numberOfItems: REPOS.length,
  itemListElement: [...REPOS]
    .sort((a, b) => b.stars - a.stars)
    .map((repo, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/repo/${repoSlug(repo)}`,
      name: `${repo.owner}/${repo.name}`,
      description: repo.description,
    })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: Repos arrive as manga panels in a vertical weekly chapter — not as GitHub cards on a cream dashboard.
OWN-WORLD: Newsprint ground, black ink borders, SVG screentone fills, rounded dialogue UI type, Bangers SFX, gutters that break on focus.
STORY: Visitor scrolls a webtoon feed of repos, filters by language/topic, pins into boards, and leaves with curated chapters.
FIRST VIEWPORT: Sticky ink-rule nav (Pinrepo mark + Feed/Boards); hero panel with AI god mode headline; search + stamp chips; speed-line rule; first full-width pin panel.
FORM: Screentone Weekly × Webtoon Scroll · seed d31fcd4c · challenger pop-culture-shelf-manga-screentone-page
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
        <JsonLd data={websiteLd} />
        <JsonLd data={orgLd} />
        <JsonLd data={itemListLd} />
        <ScreentoneDefs />
        <BoardsProvider>
          <div className="shell">
            <Nav />
            <main className="shell__main">{children}</main>
          </div>
        </BoardsProvider>
        {/* Crawlable keyword summary for search engines */}
        <aside className="seo-rail" aria-hidden="false">
          <p>
            Pinrepo indexes {REPOS.length} high-signal git repositories for AI
            coding — including Claude Code, Cursor rules, Model Context Protocol
            (MCP) servers, LangChain, OpenHands, browser-use, and more. Sort by
            top stars ({formatStars(Math.max(...REPOS.map((r) => r.stars)))}+),
            newest updates, or popular momentum.
          </p>
        </aside>
      </body>
    </html>
  );
}
