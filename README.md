# World Cup Predictor

A polished Next.js 15 analytics dashboard that predicts World Cup matchups using **only** historical FIFA World Cup finals results.

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
| `/` | Dashboard with history, ratings, charts, and interactive model controls |
| `/predict` | Head-to-head predictor with probability bars and generated explanations |
| `/players` | Searchable Argentina and Spain player-performance dataset |
| `/2026` | Argentina vs Spain prediction blending history and player strength |

## Model

For every tournament:

- Winner: `+ winnerPoints * weight` (default `3`)
- Runner-up: `+ runnerUpPoints * weight` (default `1`)

Linear recency weight:

```text
weight = 1 + (year - 1930) / recencyMultiplier
```

Optional exponential weight:

```text
weight = exp((year - 1930) / 150)
```

Probabilities use an Elo-style formula after scaling:

```text
scaledRating = 1500 + score * 40
P(A wins) = 1 / (1 + 10^((ratingB - ratingA) / 400))
```

West Germany results are merged into Germany during calculations.

### Recent form (Elo replay)

When "Use Recent Real Results" is enabled (default), real competitive results
from 2024–2026 (Euro 2024, Copa América 2024, Nations League 2025, and the
2026 World Cup group and knockout rounds, excluding the final itself) are
replayed chronologically as Elo updates on top of the historical scaled
ratings. Every 2026 team that appears in this dataset (Norway, Japan, South
Korea, Egypt, Morocco, and more) is selectable on `/predict`, starting from a
1500 baseline if it never reached a World Cup final:

```text
delta = K * (actual - expected)
```

where `K` is the match importance (80–120), `actual` is 1/0.5/0 for
win/draw/loss, and `expected` comes from the same Elo formula. A "form
influence" slider blends between history-only (0%) and the fully
form-adjusted rating (100%).

### 2026 player model

The 2026 page additionally uses a static, illustrative Argentina and Spain
roster snapshot. Individual ratings are calculated as:

```text
playerRating =
  form * 40% +
  internationalPerformance * 30% +
  experience * 20% +
  availability * 10%
```

Team player strength is 85% best positional starting XI and 15% full-squad
depth. The final 2026 team rating blends the historical rating (60%) with the
player-strength rating (40%).

## Notes

This project is an experimental rating toy — not a betting or scouting model.
Player values are not official FIFA/EA ratings, live statistics, or confirmed
2026 squad selections.
