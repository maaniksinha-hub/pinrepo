import type { MetadataRoute } from "next";
import { repoSlug } from "@/data/repos";
import { getAllRepos, getViralUpdatedAt } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const viralUpdated = new Date(getViralUpdatedAt());
  const repos = getAllRepos();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: viralUpdated,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/viral`,
      lastModified: viralUpdated,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/boards`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/guides/best-git-repos-for-ai-coding`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/feed.xml`,
      lastModified: viralUpdated,
      changeFrequency: "hourly",
      priority: 0.7,
    },
  ];

  const repoRoutes: MetadataRoute.Sitemap = repos.map((repo) => ({
    url: `${SITE_URL}/repo/${repoSlug(repo)}`,
    lastModified: new Date(repo.updatedAt || viralUpdated),
    changeFrequency: repo.viral ? ("daily" as const) : ("weekly" as const),
    priority: repo.viral ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...repoRoutes];
}
