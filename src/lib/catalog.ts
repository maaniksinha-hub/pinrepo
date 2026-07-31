import type { RepoPin } from "@/lib/types";
import { REPOS, repoSlug } from "@/data/repos";
import viralFile from "@/data/viral-repos.json";

export type ViralFile = {
  updatedAt: string;
  source: string;
  repos: RepoPin[];
};

export function getViralRepos(): RepoPin[] {
  const data = viralFile as ViralFile;
  return (data.repos ?? []).map((r) => ({
    ...r,
    viral: true,
    cover: r.cover || "/covers/viral-default.svg",
    height: r.height || "medium",
    sfx: r.sfx || "VIRAL!!",
  }));
}

export function getViralUpdatedAt(): string {
  return (viralFile as ViralFile).updatedAt || new Date().toISOString();
}

export function getAllRepos(): RepoPin[] {
  const viral = getViralRepos();
  const byKey = new Map<string, RepoPin>();
  for (const r of REPOS) {
    byKey.set(`${r.owner}/${r.name}`.toLowerCase(), r);
  }
  for (const r of viral) {
    byKey.set(`${r.owner}/${r.name}`.toLowerCase(), r);
  }
  return [...byKey.values()];
}

export function findRepoBySlug(slug: string): RepoPin | undefined {
  return getAllRepos().find((r) => repoSlug(r) === slug.toLowerCase());
}

export { repoSlug };
