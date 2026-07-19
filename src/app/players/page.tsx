"use client";

import { motion } from "framer-motion";
import { PlayerTable } from "@/components/players/PlayerTable";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLAYER_SCORE_WEIGHTS } from "@/lib/players";

const factors = [
  { label: "Recent form", value: PLAYER_SCORE_WEIGHTS.form },
  {
    label: "International performance",
    value: PLAYER_SCORE_WEIGHTS.internationalPerformance,
  },
  { label: "Experience", value: PLAYER_SCORE_WEIGHTS.experience },
  { label: "Availability", value: PLAYER_SCORE_WEIGHTS.availability },
];

export default function PlayersPage() {
  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Badge>Experimental 2026 player model</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Player performance
        </h1>
        <p className="max-w-3xl text-lg text-slate-300">
          Explore the static Argentina and Spain roster snapshot used to add a
          player-strength signal to the 2026 prediction.
        </p>
      </motion.section>

      <Card>
        <CardHeader>
          <CardTitle>How a player rating is calculated</CardTitle>
          <CardDescription>
            Each 0–100 score is a transparent weighted average. Team strength
            uses the best positional XI plus a smaller squad-depth contribution.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {factors.map((factor) => (
            <div
              key={factor.label}
              className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
            >
              <p className="text-sm text-slate-400">{factor.label}</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">
                {factor.value * 100}%
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <PlayerTable />
    </div>
  );
}
