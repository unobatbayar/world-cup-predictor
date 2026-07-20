"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelSettings } from "@/context/ModelSettingsContext";
import { useTeamModal } from "@/context/TeamModalContext";

export function TopNations() {
  const { formRankings, settings } = useModelSettings();
  const { openTeam } = useTeamModal();
  const top10 = formRankings.slice(0, 10);
  const max = top10[0]?.effectiveRating ?? 1;
  const usingForm = settings.useRecentForm && settings.formWeight > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 by live Elo</CardTitle>
        <CardDescription>
          {usingForm
            ? "Ranked by form-adjusted Elo after replaying recent real results."
            : "Recent form is off — showing historical finals baseline only."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {top10.map((team, index) => (
          <button
            key={team.team}
            type="button"
            onClick={() => openTeam(team.team)}
            className="block w-full text-left"
          >
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-100">
                <span className="mr-2 text-slate-500">{index + 1}.</span>
                {team.team}
              </span>
              <span className="font-mono text-emerald-300">
                {Math.round(team.effectiveRating)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{
                  width: `${(team.effectiveRating / max) * 100}%`,
                }}
                transition={{ duration: 0.6, delay: index * 0.04 }}
              />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
