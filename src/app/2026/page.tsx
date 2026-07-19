"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { DualTimeline } from "@/components/predict/DualTimeline";
import { ExplainPrediction } from "@/components/predict/ExplainPrediction";
import { ProbabilityBars } from "@/components/predict/ProbabilityBars";
import { TeamComparison } from "@/components/predict/TeamComparison";
import { ModelControls } from "@/components/dashboard/ModelControls";
import { PlayerModelComparison } from "@/components/players/PlayerModelComparison";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelSettings } from "@/context/ModelSettingsContext";
import {
  explainCombinedPrediction,
  predict2026Match,
} from "@/lib/players";
import { formatPercent } from "@/lib/utils";

const TEAM_A = "Argentina";
const TEAM_B = "Spain";

export default function Final2026Page() {
  const { settings } = useModelSettings();

  const result = useMemo(
    () => predict2026Match(TEAM_A, TEAM_B, settings),
    [settings]
  );

  const summary = explainCombinedPrediction(result);

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Badge>Assumed 2026 finalists</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          2026 Final Prediction
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          The model compares Argentina and Spain by blending World Cup history
          with an experimental player-performance and squad-depth rating.
        </p>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Winner probability</CardTitle>
            <CardDescription>
              60% historical rating and 40% player-strength rating.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProbabilityBars
              teamA={result.teamA}
              teamB={result.teamB}
              probabilityA={result.probabilityA}
              probabilityB={result.probabilityB}
            />
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Model edge
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {result.predictedWinner}{" "}
                <span className="text-emerald-300">
                  (
                  {formatPercent(
                    result.predictedWinner === result.teamA
                      ? result.probabilityA
                      : result.probabilityB,
                    0
                  )}
                  )
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle>Small explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-base leading-relaxed text-slate-200">
              {summary}
            </blockquote>
          </CardContent>
        </Card>
      </div>

      <ModelControls />

      <PlayerModelComparison result={result} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TeamComparison result={result} />
        <ExplainPrediction result={result} />
      </div>

      <DualTimeline teamA={TEAM_A} teamB={TEAM_B} />
    </div>
  );
}
