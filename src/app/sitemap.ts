import type { MetadataRoute } from "next";
import { REPOS, repoSlug } from "@/data/repos";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/boards`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/guides/best-git-repos-for-ai-coding`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const repoRoutes: MetadataRoute.Sitemap = REPOS.map((repo) => ({
    url: `${SITE_URL}/repo/${repoSlug(repo)}`,
    lastModified: new Date(repo.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...repoRoutes];
}
