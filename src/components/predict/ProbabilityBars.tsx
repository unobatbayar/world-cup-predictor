"use client";

import { motion } from "framer-motion";
import { formatPercent } from "@/lib/utils";

type ProbabilityBarsProps = {
  teamA: string;
  teamB: string;
  probabilityA: number;
  probabilityB: number;
};

export function ProbabilityBars({
  teamA,
  teamB,
  probabilityA,
  probabilityB,
}: ProbabilityBarsProps) {
  return (
    <div className="space-y-6">
      <BarRow team={teamA} probability={probabilityA} accent="emerald" />
      <BarRow team={teamB} probability={probabilityB} accent="sky" />
    </div>
  );
}

function BarRow({
  team,
  probability,
  accent,
}: {
  team: string;
  probability: number;
  accent: "emerald" | "sky";
}) {
  const blocks = Math.max(1, Math.round(probability * 20));
  const bar =
    accent === "emerald"
      ? "from-emerald-500 to-emerald-300"
      : "from-sky-500 to-sky-300";

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <h3 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
          {team}
        </h3>
        <p className="text-3xl font-bold text-slate-100 sm:text-4xl">
          {formatPercent(probability, 0)}
        </p>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${probability * 100}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2 font-mono text-sm tracking-widest text-slate-500">
        {"█".repeat(blocks)}
      </p>
    </div>
  );
}
