# Design System — Pinrepo

<!-- impeccable:design-schema 1 -->

## World

**Screentone Weekly × Webtoon Scroll** — black ink on newsprint, manga panel gutters, sound-effect typography, vertical chapter pacing.

## Palette

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0c0c0c` | Borders, type, decisive fills (pin stamp) |
| `--newsprint` | `#f2efe6` | Page ground |
| `--newsprint-deep` | `#e6e1d4` | Cover wells |
| `--panel` | `#faf8f2` | Panel interiors |
| `--muted` | `#3a3832` | Secondary body (tinted from ink, not gray) |

No spot color beyond ink/newsprint — tone density carries hierarchy.

## Typography

| Role | Face | Notes |
|---|---|---|
| Display / UI | Zen Maru Gothic / M PLUS Rounded 1c | Rounded dialogue-adjacent grotesk |
| SFX | Bangers | Panel exclamations, star counts, pin stamps |

Tracking on display ≈ `-0.03em`. No Inter / Space Grotesk / Playfair defaults.

## Materials & components

- Heavy ink panel borders (`3.5–5px`)
- SVG screentone patterns (`tone-10/30/50`) and CSS dot washes
- Speech-bubble language chips
- Stamp-style filter chips
- Speed-line rules (repeating diagonal bars + clip-path enter)
- Hover: denser tone + gutter-break speed lines + hard offset shadow

## Motion

| Interaction | Timing | Curve |
|---|---|---|
| Button / chip press | 140ms | `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)` · scale `0.97` |
| Panel enter | 280ms, stagger 45ms | ease-out from `translateY(10px)` + opacity |
| Sheet | 280ms | `--ease-drawer` from `translateY(18%) scale(0.96)` |
| Speed-line draw | 520ms | clip-path inset reveal |

`prefers-reduced-motion`: kill transform/clip animations; keep opacity/color. Hover motion gated behind `(hover: hover) and (pointer: fine)`.

## Layout

- Sticky nav (`--nav-h`)
- Single-column webtoon feed, max ~42rem panels inside ~52rem shell
- Boards as chapter cards with thumb grid

## Do / Don't

- Do: treat repos as panels; save as solid black emotional beat
- Don't: GitHub-dark neon chrome, cream-serif editorial default, nested cards, eyebrow kickers
