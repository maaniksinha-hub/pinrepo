#!/usr/bin/env node
/**
 * Discover git repos going viral on GitHub and merge into src/data/viral-repos.json.
 *   node scripts/refresh-viral.cjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "src/data/viral-repos.json");
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

const SFX = ["BOOM!!", "HOT!!", "FIRE!", "ZOOM!!", "BANG!", "VIRAL!!", "RISE!!"];

function daysAgoISO(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

async function ghSearch(query, sort = "stars") {
  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.set("q", query);
  url.searchParams.set("sort", sort);
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", "40");

  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "pinrepo-viral-scanner",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub search failed ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.items || [];
}

function velocityScore(item) {
  const stars = item.stargazers_count || 0;
  const created = Date.parse(item.created_at || Date.now());
  const ageDays = Math.max(0.5, (Date.now() - created) / 86400000);
  // stars per day — what “going viral” means
  return stars / ageDays;
}

function toPin(item, index, spottedAt) {
  const topics = (item.topics || []).slice(0, 5);
  const desc = (item.description || "Trending open-source repository on GitHub.").slice(
    0,
    220,
  );
  const lang = item.language || "Unknown";
  const v = Math.round(velocityScore(item));
  return {
    id: `viral-${item.id}`,
    name: item.name,
    owner: item.owner?.login || "unknown",
    description: desc,
    language: lang,
    stars: item.stargazers_count || 0,
    updatedAt: Date.parse(item.pushed_at || item.updated_at || spottedAt),
    topics: topics.length ? topics : ["trending", "github"],
    cover: "/covers/viral-default.svg",
    sfx: SFX[index % SFX.length],
    height: velocityScore(item) > 200 ? "tall" : "medium",
    godMode: `Going viral (~${v}★/day). Pin it before your AI stack falls behind.`,
    viral: true,
    spottedAt,
    htmlUrl: item.html_url,
  };
}

function isAiRelevant(item) {
  const blob = [item.name, item.description || "", ...(item.topics || [])]
    .join(" ")
    .toLowerCase();
  return /ai|llm|gpt|claude|cursor|mcp|agent|langchain|openai|anthropic|rag|transformer|mlops|copilot|agentic/.test(
    blob,
  );
}

async function main() {
  const spottedAt = new Date().toISOString();
  const since14 = daysAgoISO(14);
  const since7 = daysAgoISO(7);
  const since3 = daysAgoISO(3);

  // Focus on NEW repos gaining stars fast — not evergreen titans
  const queries = [
    `created:>${since7} stars:>100`,
    `created:>${since14} stars:>250`,
    `created:>${since3} stars:>50`,
    `created:>${since14} stars:>80 (ai OR llm OR mcp OR claude OR cursor OR agent)`,
    `created:>${since7} stars:>40 topic:mcp`,
    `created:>${since7} stars:>40 topic:llm`,
  ];

  const seen = new Map();
  for (const q of queries) {
    try {
      const items = await ghSearch(q, "stars");
      for (const item of items) {
        const key = `${item.full_name}`.toLowerCase();
        if (!seen.has(key)) seen.set(key, item);
      }
      await new Promise((r) => setTimeout(r, 700));
    } catch (err) {
      console.error("query failed", q, err.message);
    }
  }

  let ranked = [...seen.values()]
    .filter((item) => {
      const ageDays =
        (Date.now() - Date.parse(item.created_at || Date.now())) / 86400000;
      // Must be young enough to count as "going viral"
      return ageDays <= 45 && (item.stargazers_count || 0) >= 40;
    })
    .sort((a, b) => velocityScore(b) - velocityScore(a));

  const ai = ranked.filter(isAiRelevant);
  const rest = ranked.filter((x) => !isAiRelevant(x));
  ranked = [...ai, ...rest].slice(0, 30);

  let existing = { updatedAt: spottedAt, source: "github-search", repos: [] };
  if (fs.existsSync(OUT)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUT, "utf8"));
    } catch {
      /* ignore */
    }
  }

  const byKey = new Map();
  // Drop stale evergreen leftovers from prior runs (no spottedAt / too old)
  for (const r of existing.repos || []) {
    const age =
      (Date.now() - Date.parse(r.spottedAt || r.updatedAt || 0)) / 86400000;
    if (age <= 60) byKey.set(`${r.owner}/${r.name}`.toLowerCase(), r);
  }

  ranked.forEach((item, i) => {
    const pin = toPin(item, i, spottedAt);
    const key = `${pin.owner}/${pin.name}`.toLowerCase();
    const prev = byKey.get(key);
    byKey.set(key, {
      ...pin,
      spottedAt: prev?.spottedAt || spottedAt,
      stars: Math.max(prev?.stars || 0, pin.stars),
    });
  });

  const repos = [...byKey.values()]
    .sort((a, b) => {
      const va = (a.stars || 0) / Math.max(1, (Date.now() - (a.updatedAt || Date.now())) / 86400000);
      const vb = (b.stars || 0) / Math.max(1, (Date.now() - (b.updatedAt || Date.now())) / 86400000);
      // Prefer recently spotted viral
      const sa = Date.parse(a.spottedAt || 0);
      const sb = Date.parse(b.spottedAt || 0);
      if (Math.abs(sb - sa) > 86400000) return sb - sa;
      return vb - va;
    })
    .slice(0, 60);

  const payload = {
    updatedAt: spottedAt,
    source: "github-search-velocity",
    repos,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");
  console.log(`Wrote ${repos.length} viral repos → ${OUT}`);
  console.log(
    repos
      .slice(0, 12)
      .map((r) => `${r.owner}/${r.name} ★${r.stars}`)
      .join("\n"),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
