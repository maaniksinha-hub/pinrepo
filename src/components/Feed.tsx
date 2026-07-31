"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PinPanel } from "@/components/PinPanel";
import { LANGUAGES, REPOS, TOPICS } from "@/data/repos";
import type { FeedSort } from "@/lib/types";

const SORTS: { id: FeedSort; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "newest", label: "Newest" },
  { id: "popular", label: "Popular" },
];

export function Feed() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [sort, setSort] = useState<FeedSort>("top");
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>("All");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("All");
  const [query, setQuery] = useState(initialQ);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = REPOS.filter((repo) => {
      if (language !== "All" && repo.language !== language) return false;
      if (topic !== "All" && !repo.topics.includes(topic)) return false;
      if (!q) return true;
      return (
        repo.name.toLowerCase().includes(q) ||
        repo.owner.toLowerCase().includes(q) ||
        repo.description.toLowerCase().includes(q) ||
        repo.godMode.toLowerCase().includes(q) ||
        repo.topics.some((t) => t.includes(q))
      );
    });

    const sorted = [...list];
    if (sort === "newest") {
      sorted.sort((a, b) => b.updatedAt - a.updatedAt);
    } else if (sort === "popular") {
      // Popular = stars × recency boost for “hot” repos
      const score = (r: (typeof REPOS)[number]) => {
        const ageDays = Math.max(1, (Date.now() - r.updatedAt) / 86400000);
        return r.stars / Math.sqrt(ageDays);
      };
      sorted.sort((a, b) => score(b) - score(a));
    } else {
      // Top = raw stars
      sorted.sort((a, b) => b.stars - a.stars);
    }
    return sorted;
  }, [language, topic, query, sort]);

  return (
    <div className="feed">
      <section className="feed__hero">
        <h1 className="feed__title">
          AI god mode
          <span className="feed__title-sfx"> REPOS!!</span>
        </h1>
        <p className="feed__lede">
          Top, newest, and hottest git repositories that make Claude, Cursor,
          and agent stacks unfairly powerful — pin your arsenal.
        </p>
        <p className="feed__demo">Curated sample catalog · stars/dates for demo</p>
      </section>

      <div className="feed__controls">
        <div className="feed__sorts" role="tablist" aria-label="Sort feed">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              className="sort"
              aria-selected={sort === s.id}
              data-active={sort === s.id ? "true" : "false"}
              onClick={() => setSort(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label className="feed__search">
          <span className="visually-hidden">Search repositories</span>
          <input
            type="search"
            placeholder="Search MCP, Claude, Cursor, agents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="feed__chips" role="group" aria-label="Language">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              className="chip"
              data-active={language === lang ? "true" : "false"}
              onClick={() => setLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="feed__chips" role="group" aria-label="Topic">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              className="chip chip--topic"
              data-active={topic === t ? "true" : "false"}
              onClick={() => setTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="feed__speedline" aria-hidden="true" />

      {filtered.length === 0 ? (
        <div className="feed__empty" role="status">
          <p className="feed__empty-sfx">…</p>
          <p>No panels match. Loosen a filter or try another search.</p>
        </div>
      ) : (
        <div className="feed__chapter" aria-label="Repository feed">
          {filtered.map((pin, i) => (
            <PinPanel key={pin.id} pin={pin} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
