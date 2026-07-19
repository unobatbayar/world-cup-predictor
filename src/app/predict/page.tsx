"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DualTimeline } from "@/components/predict/DualTimeline";
import { ExplainPrediction } from "@/components/predict/ExplainPrediction";
import { ProbabilityBars } from "@/components/predict/ProbabilityBars";
import { RecentFormPanel } from "@/components/predict/RecentFormPanel";
import { TeamComparison } from "@/components/predict/TeamComparison";
import { ModelControls } from "@/components/dashboard/ModelControls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModelSettings } from "@/context/ModelSettingsContext";
import { predictMatch } from "@/lib/predict";

export default function PredictPage() {
  const { teams, settings } = useModelSettings();
  const [teamA, setTeamA] = useState("Argentina");
  const [teamB, setTeamB] = useState("Spain");
  const [hasPredicted, setHasPredicted] = useState(true);

  const result = useMemo(
    () => predictMatch(teamA, teamB, settings),
    [teamA, teamB, settings]
  );

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Match predictor
        </h1>
        <p className="max-w-2xl text-slate-300">
          Choose any two World Cup finalists and convert their historical ratings
          into Elo-style win probabilities.
        </p>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Select teams</CardTitle>
            <CardDescription>
              Probabilities update instantly when you change model controls.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Team A</Label>
              <Select value={teamA} onValueChange={setTeamA}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team A" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team} disabled={team === teamB}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Team B</Label>
              <Select value={teamB} onValueChange={setTeamB}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team B" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team} disabled={team === teamA}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => setHasPredicted(true)}
            >
              Predict Winner
            </Button>
          </CardContent>
        </Card>

        <ModelControls />
      </div>

      {hasPredicted && (
        <motion.div
          key={`${teamA}-${teamB}-${settings.weightMode}-${settings.winnerPoints}-${settings.runnerUpPoints}-${settings.recencyDivisor}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Win probabilities</CardTitle>
              <CardDescription>
                Scaled ratings use{" "}
                <code>1500 + score × 40</code> before the Elo formula.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProbabilityBars
                teamA={result.teamA}
                teamB={result.teamB}
                probabilityA={result.probabilityA}
                probabilityB={result.probabilityB}
              />
            </CardContent>
          </Card>

          <RecentFormPanel result={result} />

          <div className="grid gap-6 lg:grid-cols-2">
            <TeamComparison result={result} />
            <ExplainPrediction result={result} />
          </div>

          <DualTimeline teamA={result.teamA} teamB={result.teamB} />
        </motion.div>
      )}
    </div>
  );
}
