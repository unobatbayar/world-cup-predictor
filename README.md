# World Cup Predictor

A Next.js 15 analytics dashboard that predicts World Cup matchups primarily
from **recent real competitive results**, with historical finals data kept as
optional background context.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Framer Motion
- shadcn-style Radix UI primitives

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
| --- | --- |
| `/` | Dashboard with live Elo rankings, charts, and model controls |
| `/predict` | Head-to-head predictor driven by recent-form Elo |
| `/players` | Searchable Argentina and Spain player-performance dataset |
| `/2026` | Argentina vs Spain prediction blending recent Elo and squad strength |

## Model

### Primary: recent-form Elo (default)

Verified 2024–2026 competitive results (Euro 2024, Copa América 2024, Nations
League 2025, and the 2026 World Cup group/knockout rounds — excluding the
final itself) are replayed chronologically as Elo updates:

```text
delta = K * (actual - expected)
```

`K` is match importance (60–120). Teams with no World Cup finals history start
from a 1500 baseline and still appear in `/predict`.

Form influence defaults to **100%**, meaning forecasts use the fully
form-adjusted rating.

### Secondary: 2026 player blend

On `/2026`, the final rating is:

```text
75% recent-form Elo + 25% experimental squad rating
```

### Legacy: historical finals scoring (advanced)

Optional 1930–2022 winner/runner-up points still exist under **Advanced**, but
they are only used as an Elo starting baseline. They do not drive the live
predictions when recent form is enabled.

West Germany results are merged into Germany during calculations.

## Notes

This project is an experimental rating toy — not a betting or scouting model.
Player values are not official FIFA/EA ratings or live licensed feeds.
