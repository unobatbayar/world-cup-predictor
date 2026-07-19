"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PredictionResult } from "@/lib/types";
import { formatScore } from "@/lib/utils";

type TeamComparisonProps = {
  result: PredictionResult;
};

export function TeamComparison({ result }: TeamComparisonProps) {
  const rows = [
    {
      label: "Historical score",
      a: formatScore(result.statsA.score),
      b: formatScore(result.statsB.score),
    },
    {
      label: "Recency weighted score",
      a: formatScore(result.statsA.score),
      b: formatScore(result.statsB.score),
    },
    {
      label: "Scaled Elo rating",
      a: Math.round(result.statsA.scaledRating).toString(),
      b: Math.round(result.statsB.scaledRating).toString(),
    },
    {
      label: "Form-adjusted rating",
      a: Math.round(result.effectiveRatingA).toString(),
      b: Math.round(result.effectiveRatingB).toString(),
    },
    {
      label: "Titles",
      a: result.statsA.titles.toString(),
      b: result.statsB.titles.toString(),
    },
    {
      label: "Runner-up finishes",
      a: result.statsA.runnerUps.toString(),
      b: result.statsB.runnerUps.toString(),
    },
    {
      label: "Finals appearances",
      a: result.statsA.finals.toString(),
      b: result.statsB.finals.toString(),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical comparison</CardTitle>
        <CardDescription>
          Side-by-side statistics under the current scoring model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 text-left font-medium">Metric</th>
                <th className="pb-3 text-right font-medium">{result.teamA}</th>
                <th className="pb-3 text-right font-medium">{result.teamB}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-slate-800/70">
                  <td className="py-3 text-slate-300">{row.label}</td>
                  <td className="py-3 text-right font-mono text-emerald-300">
                    {row.a}
                  </td>
                  <td className="py-3 text-right font-mono text-sky-300">
                    {row.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
            Predicted winner
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">
            {result.predictedWinner}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
