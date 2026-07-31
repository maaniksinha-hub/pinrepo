#!/usr/bin/env node
/**
 * Create a unique 1200×400 B&W manga ink cover for a viral repo.
 *
 * Image provider priority:
 *   1. OpenRouter (OPENROUTER_API_KEY) — preferred
 *   2. OpenAI direct (OPENAI_API_KEY)
 *   3. Procedural screentone/ink SVG fallback
 *
 *   node scripts/generate-cover.cjs --owner kvcache-ai --name AgentENV --desc "..."
 *   node scripts/generate-cover.cjs --from-json   # fill missing covers in viral-repos.json
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const COVERS = path.join(ROOT, "public/covers");
const VIRAL_JSON = path.join(ROOT, "src/data/viral-repos.json");
const W = 1200;
const H = 400;

const SCENE_BANK = [
  "spiky-haired martial artist powering up with ink aura and speed lines",
  "elf mage girl casting a glowing rune circle from an open grimoire",
  "navigator girl reading a constellation map of connected nodes",
  "mecha pilot reflected in a HUD cockpit of ink-line panels",
  "assassin youth with electric sparks touching floating translucent windows",
  "diverse adventurer crew on a ship deck under dramatic sky hatching",
  "twin alchemists forging glowing chains of runes in a workshop",
  "soft forest spirit beast guarding a glowing index crystal",
  "scientist before CRT monitors of branching equations",
  "theater director controlling floating browser frames like stage props",
  "dark-haired student writing glowing rules into a black notebook",
  "swordsman with elemental skill icons orbiting in night rain",
  "hacker girl mid-leap through a city of circuit skyscrapers",
  "robot companion and coder sharing a ramen bowl of light",
  "fox spirit trickster weaving fiber-optic tails into a network",
];

function slugify(owner, name) {
  return `${owner}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function coverPath(owner, name) {
  return `/covers/viral-${slugify(owner, name)}.webp`;
}

function coverFile(owner, name) {
  return path.join(COVERS, `viral-${slugify(owner, name)}.webp`);
}

function buildPrompt({ owner, name, description, language, topics }) {
  const seed = hash(`${owner}/${name}`);
  const scene = SCENE_BANK[seed % SCENE_BANK.length];
  const topicHint = (topics || []).slice(0, 3).join(", ") || language || "software";
  const vibe = (description || "open source developer tool").slice(0, 120);

  return [
    "Ultra-wide manga cover banner 3:1 landscape composition.",
    "STRICT black-and-white ink sketch ONLY — monochrome, screentone halftone dots,",
    "cross-hatching, bold Toriyama-inspired shonen linework, printed comic book look, no color, no sepia.",
    "Heavy ink panel borders, torn-edge panel collage across a wide cinematic frame,",
    "speed lines, dramatic lighting as pure ink/white, newsprint atmosphere.",
    `Subject: ${scene}, themed subtly around ${topicHint}.`,
    `Mood inspired by repository "${owner}/${name}": ${vibe}.`,
    "Original character designs only — no logos, no readable UI text, no watermarks, no real person likeness.",
    "High contrast black ink on white, ready as a card cover.",
  ].join(" ");
}

async function toInkBanner(inputBuffer) {
  // Fit to 1200×400, then punch ink/sketch contrast
  return sharp(inputBuffer)
    .resize(W, H, { fit: "cover", position: "attention" })
    .grayscale()
    .modulate({ brightness: 1.05, saturation: 0 })
    .linear(1.35, -28)
    .sharpen({ sigma: 1.1 })
    .webp({ quality: 86 })
    .toBuffer();
}

function proceduralSvg({ owner, name }) {
  const seed = hash(`${owner}/${name}`);
  const scene = seed % SCENE_BANK.length;
  const dens = 4 + (seed % 6);
  const rot = (seed % 24) - 12;
  const accent = 40 + (seed % 160);
  const panels = [
    { x: 20, y: 20, w: 520, h: 360 },
    { x: 560, y: 20, w: 300, h: 170 },
    { x: 560, y: 210, w: 300, h: 170 },
    { x: 880, y: 20, w: 300, h: 360 },
  ];

  const silhouettes = [
    // fighter aura
    `<ellipse cx="280" cy="300" rx="90" ry="40" fill="#111"/><circle cx="280" cy="150" r="48" fill="#111"/><path d="M230 200 L280 240 L330 200 L320 320 L240 320 Z" fill="#111"/><circle cx="280" cy="200" r="110" fill="none" stroke="#111" stroke-width="6" opacity=".35"/>`,
    // mage + tome
    `<circle cx="260" cy="140" r="44" fill="#111"/><path d="M210 190 Q260 170 310 190 L300 330 L220 330 Z" fill="#111"/><rect x="300" y="210" width="70" height="50" fill="#fff" stroke="#111" stroke-width="5"/><circle cx="335" cy="180" r="55" fill="none" stroke="#111" stroke-width="4" stroke-dasharray="4 6"/>`,
    // navigator
    `<circle cx="270" cy="145" r="42" fill="#111"/><path d="M220 190 L270 210 L320 190 L310 330 L230 330 Z" fill="#111"/><circle cx="400" cy="200" r="90" fill="none" stroke="#111" stroke-width="4"/><circle cx="400" cy="200" r="50" fill="none" stroke="#111" stroke-width="3"/>`,
    // mecha pilot
    `<rect x="180" y="90" width="220" height="240" rx="18" fill="none" stroke="#111" stroke-width="8"/><circle cx="290" cy="180" r="40" fill="#111"/><path d="M240 230 L290 250 L340 230 L330 320 L250 320 Z" fill="#111"/>`,
  ];

  const sil = silhouettes[scene % silhouettes.length];
  const dots = [];
  for (let y = 0; y < H; y += dens) {
    for (let x = (y / dens) % 2 === 0 ? 0 : dens / 2; x < W; x += dens) {
      if (((x * 31 + y * 17 + seed) % 11) < 3) {
        dots.push(`<circle cx="${x}" cy="${y}" r="1.1" fill="#111" opacity=".28"/>`);
      }
    }
  }

  const speed = [];
  for (let i = 0; i < 18; i++) {
    const y = 40 + ((seed + i * 37) % 320);
    speed.push(
      `<line x1="640" y1="${y}" x2="1180" y2="${y - 10 + (i % 5)}" stroke="#111" stroke-width="${1 + (i % 3)}" opacity=".22"/>`,
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="#f2efe6"/>
  <g opacity=".9">${dots.join("")}</g>
  ${panels
    .map(
      (p, i) =>
        `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="#faf8f2" stroke="#0c0c0c" stroke-width="6"/>`,
    )
    .join("")}
  <g transform="translate(40,10) rotate(${rot} 280 220)">${sil}</g>
  <g>${speed.join("")}</g>
  <circle cx="${900 + (seed % 80)}" cy="${120 + (accent % 80)}" r="70" fill="none" stroke="#0c0c0c" stroke-width="5" opacity=".45"/>
  <path d="M20 20 L40 8 L60 20 L40 36 Z" fill="#0c0c0c"/>
  <path d="M1140 360 L1165 340 L1185 365 L1160 385 Z" fill="#0c0c0c"/>
</svg>`;
}

async function decodeImageResponse(data, label) {
  const b64 = data.data?.[0]?.b64_json;
  if (b64) return Buffer.from(b64, "base64");
  const url = data.data?.[0]?.url;
  if (url) {
    const img = await fetch(url);
    return Buffer.from(await img.arrayBuffer());
  }
  throw new Error(`${label} response missing image data`);
}

function openRouterHeaders() {
  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.OPENROUTER_REFERER || "https://pinrepo.vercel.app",
    "X-Title": process.env.OPENROUTER_TITLE || "Pinrepo",
  };
}

async function generateWithOpenRouter(prompt) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  const model =
    process.env.OPENROUTER_IMAGE_MODEL || "openai/gpt-image-1-mini";
  const body = {
    model,
    prompt,
    quality: "high",
    output_format: "png",
  };

  // OpenAI image models on OpenRouter accept 3:2, not 16:9 — we crop to 1200×400 later
  if (model.startsWith("openai/")) {
    body.aspect_ratio = "3:2";
  } else {
    body.aspect_ratio = "16:9";
  }

  const res = await fetch("https://openrouter.ai/api/v1/images", {
    method: "POST",
    headers: openRouterHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter image failed ${res.status}: ${text.slice(0, 280)}`);
  }

  return decodeImageResponse(await res.json(), "OpenRouter");
}

async function generateWithOpenAI(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt,
      size: "1536x1024",
      quality: "high",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI image failed ${res.status}: ${text.slice(0, 240)}`);
  }
  const data = await res.json();
  return decodeImageResponse(data, "OpenAI");
}

async function generateWithAI(prompt) {
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const buf = await generateWithOpenRouter(prompt);
      if (buf) return { buf, provider: "openrouter" };
    } catch (err) {
      console.warn(`  OpenRouter cover skipped: ${err.message}`);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const buf = await generateWithOpenAI(prompt);
      if (buf) return { buf, provider: "openai" };
    } catch (err) {
      console.warn(`  OpenAI cover skipped: ${err.message}`);
    }
  }

  return null;
}

async function ensureCover(repo, { force = false } = {}) {
  fs.mkdirSync(COVERS, { recursive: true });
  const file = coverFile(repo.owner, repo.name);
  const publicPath = coverPath(repo.owner, repo.name);

  if (!force && fs.existsSync(file) && fs.statSync(file).size > 2000) {
    return publicPath;
  }

  const prompt = buildPrompt(repo);
  let raw = null;
  const ai = await generateWithAI(prompt);
  if (ai) {
    raw = ai.buf;
    console.log(`  AI cover (${ai.provider}) → ${path.basename(file)}`);
  }

  if (!raw) {
    const svg = proceduralSvg(repo);
    raw = await sharp(Buffer.from(svg)).png().toBuffer();
    console.log(`  procedural cover → ${path.basename(file)}`);
  }

  const out = await toInkBanner(raw);
  fs.writeFileSync(file, out);
  return publicPath;
}

async function fromJson({ force = false } = {}) {
  const data = JSON.parse(fs.readFileSync(VIRAL_JSON, "utf8"));
  for (const repo of data.repos || []) {
    const cover = await ensureCover(repo, { force });
    repo.cover = cover;
  }
  fs.writeFileSync(VIRAL_JSON, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated covers for ${(data.repos || []).length} viral repos`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--from-json")) {
    await fromJson({ force: args.includes("--force") });
    return;
  }

  const get = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : "";
  };
  const owner = get("--owner");
  const name = get("--name");
  if (!owner || !name) {
    console.error(
      "Usage: node scripts/generate-cover.cjs --owner ORG --name REPO [--desc text]\n   or: node scripts/generate-cover.cjs --from-json [--force]",
    );
    process.exit(1);
  }
  const cover = await ensureCover(
    {
      owner,
      name,
      description: get("--desc"),
      language: get("--lang"),
      topics: (get("--topics") || "").split(",").filter(Boolean),
    },
    { force: args.includes("--force") },
  );
  console.log(cover);
}

module.exports = { ensureCover, coverPath, coverFile, buildPrompt, slugify };

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
