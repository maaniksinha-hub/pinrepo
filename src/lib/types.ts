export type RepoPin = {
  id: string;
  name: string;
  owner: string;
  description: string;
  language: string;
  stars: number;
  /** Unix ms — used for Newest sort */
  updatedAt: number;
  topics: string[];
  /** Path under /public, e.g. /covers/claude-code.webp */
  cover: string;
  sfx: string;
  height: "short" | "medium" | "tall";
  /** Why this helps AI tools go god mode */
  godMode: string;
  /** Discovered via daily viral scanner */
  viral?: boolean;
  /** ISO date when first spotted as viral */
  spottedAt?: string;
  htmlUrl?: string;
};

export type Board = {
  id: string;
  name: string;
  pinIds: string[];
  createdAt: number;
};

export type FeedSort = "top" | "newest" | "popular" | "viral";
