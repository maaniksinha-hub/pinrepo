import type { Metadata } from "next";
import { BoardsProvider } from "@/hooks/useBoards";
import { Nav } from "@/components/Nav";
import { ScreentoneDefs } from "@/components/ScreentoneDefs";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { repoSlug } from "@/data/repos";
import { getAllRepos } from "@/lib/catalog";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Viral Git Repos for AI Coding (Claude, Cursor, MCP)`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Daily board of viral GitHub repositories for AI coding — Claude, Cursor, MCP, agents. Catch breakout git repos as they climb, then pin your god-mode arsenal.",
  keywords: [
    "viral github repos",
    "git repositories going viral",
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
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Pinrepo viral digest" }],
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Viral git repos for AI coding`,
    description:
      "Daily-updated viral GitHub board for Claude, Cursor, and AI agents. Catch breakouts early.",
    locale: "en_US",
    images: [
      {
        url: "/covers/mcp-servers.webp",
        width: 1200,
        height: 400,
        alt: "Pinrepo — AI git repository covers in ink sketch style",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Viral git repos for AI coding`,
    description:
      "Repos going viral today for Claude, Cursor, MCP, and agents — updated every few hours.",
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

const catalog = getAllRepos();

const itemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Viral and curated git repositories for AI coding",
  itemListOrder: "https://schema.org/ItemListOrderDescending",
  numberOfItems: catalog.length,
  itemListElement: [...catalog]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 40)
    .map((repo, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/repo/${repoSlug(repo)}`,
      name: `${repo.owner}/${repo.name}`,
      description: repo.description,
    })),
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Pinrepo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pinrepo is a daily-updated board of viral GitHub repositories for AI coding tools like Claude, Cursor, and MCP — plus curated essentials you can pin into personal boards.",
      },
    },
    {
      "@type": "Question",
      name: "How often does Pinrepo find viral git repos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pinrepo scans GitHub multiple times per day for young repositories with high star velocity, then publishes them on the home feed, /viral digest, and RSS.",
      },
    },
    {
      "@type": "Question",
      name: "Which AI coding tools are covered?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Claude Code, Cursor, Model Context Protocol (MCP) servers, AI agents, RAG stacks, and browser automation repos that unlock god-mode developer workflows.",
      },
    },
  ],
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
        <JsonLd data={faqLd} />
        <ScreentoneDefs />
        <BoardsProvider>
          <div className="shell">
            <Nav />
            <main className="shell__main">{children}</main>
          </div>
        </BoardsProvider>
        <aside className="seo-rail" aria-hidden="false">
          <p>
            Pinrepo tracks viral GitHub repositories and curated git repos for
            AI coding — Claude Code, Cursor, Model Context Protocol (MCP),
            agents, and breakout tools. Sort by viral momentum, top stars,
            newest updates, or popular velocity. Fresh discoveries land every
            few hours.
          </p>
        </aside>
      </body>
    </html>
  );
}
