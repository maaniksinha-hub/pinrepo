import { getAllRepos, getViralUpdatedAt } from "@/lib/catalog";
import { repoSlug } from "@/data/repos";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const repos = getAllRepos()
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 40);
  const updated = getViralUpdatedAt();

  const items = repos
    .map((repo) => {
      const link = `${SITE_URL}/repo/${repoSlug(repo)}`;
      const title = `${repo.owner}/${repo.name}${repo.viral ? " (viral)" : ""}`;
      const desc = `${repo.description} — ${repo.godMode}`;
      return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(repo.updatedAt || updated).toUTCString()}</pubDate>
      <description><![CDATA[${desc}]]></description>
      <category>${repo.viral ? "viral" : "curated"}</category>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Viral git repos for AI coding</title>
    <link>${SITE_URL}</link>
    <description>Daily-updated board of viral GitHub repositories and AI coding essentials for Claude, Cursor, and MCP.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
