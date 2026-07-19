"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { Card, CardContent } from "@/components/ui/card";
import { useModelSettings } from "@/context/ModelSettingsContext";

export function StatCounters() {
  const { tournamentCount, countryCount, totalTitles } = useModelSettings();

  const stats = [
    { label: "Tournaments", value: tournamentCount },
    { label: "Countries", value: countryCount },
    { label: "Titles awarded", value: totalTitles },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-3 text-4xl font-semibold text-emerald-300">
                <AnimatedCounter value={stat.value} />
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
