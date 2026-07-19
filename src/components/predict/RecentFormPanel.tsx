"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { describeMatchOutcome, getRecentTeamMatches } from "@/lib/form";
import type { MatchResult, PredictionResult } from "@/lib/types";

export function RecentFormPanel({ result }: { result: PredictionResult }) {
  const matchesA = useMemo(
    () => getRecentTeamMatches(result.teamA),
    [result.teamA]
  );
  const matchesB = useMemo(
    () => getRecentTeamMatches(result.teamB),
    [result.teamB]
  );

  const formEnabled = result.formWeight > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent real results</CardTitle>
        <CardDescription>
          {formEnabled
            ? `Actual competitive matches since 2024, replayed as Elo updates (form influence ${Math.round(result.formWeight * 100)}%).`
            : "Recent form is currently disabled — the prediction uses World Cup history only."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <RatingDelta
            team={result.teamA}
            historical={result.statsA.scaledRating}
            effective={result.effectiveRatingA}
            tone="emerald"
          />
          <RatingDelta
            team={result.teamB}
            historical={result.statsB.scaledRating}
            effective={result.effectiveRatingB}
            tone="sky"
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <FormColumn team={result.teamA} matches={matchesA} />
          <FormColumn team={result.teamB} matches={matchesB} />
        </div>
      </CardContent>
    </Card>
  );
}

function RatingDelta({
  team,
  historical,
  effective,
  tone,
}: {
  team: string;
  historical: number;
  effective: number;
  tone: "emerald" | "sky";
}) {
  const delta = effective - historical;
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <p className="text-sm font-medium text-slate-200">{team}</p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-mono text-sm text-slate-500">
          {Math.round(historical)}
        </span>
        <span className="text-slate-500">→</span>
        <span
          className={
            tone === "emerald"
              ? "font-mono text-2xl font-semibold text-emerald-300"
              : "font-mono text-2xl font-semibold text-sky-300"
          }
        >
          {Math.round(effective)}
        </span>
        <span
          className={
            delta >= 0
              ? "font-mono text-sm text-emerald-400"
              : "font-mono text-sm text-rose-400"
          }
        >
          {delta >= 0 ? "+" : ""}
          {Math.round(delta)}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Historical → form-adjusted rating
      </p>
    </div>
  );
}

function FormColumn({
  team,
  matches,
}: {
  team: string;
  matches: MatchResult[];
}) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-medium text-slate-200">{team}</h4>
      {matches.length === 0 ? (
        <p className="text-sm text-slate-500">
          No matches in the recent-results dataset.
        </p>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => {
            const outcome = describeMatchOutcome(match, team);
            const opponent = match.teamA === team ? match.teamB : match.teamA;
            const score =
              match.scoreA !== null && match.scoreB !== null
                ? match.teamA === team
                  ? `${match.scoreA}–${match.scoreB}`
                  : `${match.scoreB}–${match.scoreA}`
                : outcome === "win"
                  ? "W"
                  : outcome === "loss"
                    ? "L"
                    : "D";
            return (
              <div
                key={`${match.date}-${match.teamA}-${match.teamB}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate text-slate-200">vs {opponent}</p>
                  <p className="truncate text-xs text-slate-500">
                    {match.competition} · {match.stage}
                  </p>
                </div>
                <Badge
                  className={
                    outcome === "win"
                      ? "shrink-0 border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : outcome === "loss"
                        ? "shrink-0 border-rose-400/30 bg-rose-400/10 text-rose-300"
                        : "shrink-0 border-slate-500/30 bg-slate-500/10 text-slate-300"
                  }
                >
                  {outcome === "draw" ? "D" : score}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
