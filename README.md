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
| `/2026` | Automatic Argentina vs Spain final prediction |

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

## Notes

This project is an experimental historical rating toy — not a betting or scouting model.
