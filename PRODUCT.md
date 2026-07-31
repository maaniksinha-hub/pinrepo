# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js (App Router) + React + TypeScript + CSS Modules / modern CSS. Chosen for a masonry discovery feed, client interactivity, and polished micro-interactions without overbuilding backend scope for v1.

## Users

Primary users are developers who use AI coding tools (Claude, Cursor, Copilot, agent CLIs) and want a curated feed of the **repos that unlock god mode** — MCP servers, agent runtimes, rules packs, memory/RAG layers, and browser automation.

Secondary: people sharing “AI arsenal” boards with teammates.

## Product Purpose

Pinrepo showcases **top / newest / popular** git repositories purpose-built to amplify AI tools. Success means a visitor finds the right MCP, agent, or Cursor/Claude skill fast, understands why it matters (“god mode” line), and pins it into a board they reopen.

## Positioning

Not another generic trending-repos site. Pinrepo is an **AI-tooling arsenal board**: anime-panel covers, Top/Newest/Popular sorts, and god-mode blurbs for Claude/Cursor workflows. Mechanism is visual curation of AI leverage, not source hosting.

## Capabilities

- Browse a masonry feed of repository pins (name, short description, language, stars, cover/visual)
- Filter and explore by language, topic, and trending/fresh signals
- Pin/save repositories to personal boards
- Create and view thematic boards (collections of repos)
- Open a pin for richer detail (README excerpt, topics, links out to the real git host)
- Lightweight search across pinned and feed content

v1 is a polished frontend with rich synthetic/demo data. Live GitHub API wiring is optional later and not required for the first experience.

## Constraints

- No claim to host git repositories or replace GitHub/GitLab
- Demo/synthetic repo data must be clearly labeled where a visitor could mistake it for live product data
- Prefer client-feel performance: snappy pin interactions, no sluggish feed animations
- Accessibility: keyboard operable, reduced-motion respected, meaningful contrast

## Terminology

- **Pin** — a repository presented as a visual card in the feed or on a board
- **Board** — a named collection of pins (thematic curation)
- **Feed** — the main masonry discovery surface
- **Save / Pin** — add a repository to a board

## Brand Commitments

- Product name: **Pinrepo**
- Voice: clear, craft-minded, developer-adjacent — not hype, not enterprise jargon
- Binding request: UI craft via Impeccable; micro-interactions and delight via Emil Kowalski design-engineering principles (responsive press, purposeful motion, no animation theater)

## Open Decisions

- Whether v1 ships with real GitHub OAuth / API or stays fully demo-data (default: demo-data with a clear path to wire later)
- Persistence of boards (localStorage vs backend) — default local for v1 unless scope expands
