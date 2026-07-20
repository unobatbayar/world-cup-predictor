"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  CombinedPredictionResult,
  PlayerTeamStrength,
} from "@/lib/types";
import { formatPercent } from "@/lib/utils";

export function PlayerModelComparison({
  result,
}: {
  result: CombinedPredictionResult;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Player-strength model</CardTitle>
        <CardDescription>
          Best positional XI contributes 85%; full-squad depth contributes 15%.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TeamStrength strength={result.playerStrengthA} tone="emerald" />
          <TeamStrength strength={result.playerStrengthB} tone="sky" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 text-left font-medium">Prediction lens</th>
                <th className="pb-3 text-right font-medium">{result.teamA}</th>
                <th className="pb-3 text-right font-medium">{result.teamB}</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                label="Recent-form Elo only"
                a={formatPercent(result.historicalProbabilityA)}
                b={formatPercent(result.historicalProbabilityB)}
              />
              <ComparisonRow
                label={`Blended (${Math.round(result.historicalWeight * 100)}/${Math.round(result.playerWeight * 100)})`}
                a={formatPercent(result.probabilityA)}
                b={formatPercent(result.probabilityB)}
              />
              <ComparisonRow
                label="Combined rating"
                a={result.combinedRatingA.toFixed(0)}
                b={result.combinedRatingB.toFixed(0)}
              />
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamStrength({
  strength,
  tone,
}: {
  strength: PlayerTeamStrength;
  tone: "emerald" | "sky";
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-100">{strength.team}</h3>
        <span
          className={
            tone === "emerald"
              ? "font-mono text-xl font-semibold text-emerald-300"
              : "font-mono text-xl font-semibold text-sky-300"
          }
        >
          {strength.playerRating.toFixed(1)}
        </span>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Starting XI</dt>
          <dd className="font-mono text-slate-300">
            {strength.startingXIRating.toFixed(1)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Squad depth</dt>
          <dd className="font-mono text-slate-300">
            {strength.depthRating.toFixed(1)}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {strength.startingXI.map((player) => (
          <span
            key={player.id}
            title={`${player.name}: ${player.rating.toFixed(1)}`}
            className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300"
          >
            {player.name.split(" ").at(-1)}
          </span>
        ))}
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  a,
  b,
}: {
  label: string;
  a: string;
  b: string;
}) {
  return (
    <tr className="border-b border-slate-800/70 last:border-0">
      <td className="py-3 text-slate-300">{label}</td>
      <td className="py-3 text-right font-mono text-emerald-300">{a}</td>
      <td className="py-3 text-right font-mono text-sky-300">{b}</td>
    </tr>
  );
}
