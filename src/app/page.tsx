"use client";

import { motion } from "framer-motion";
import { FinalsBarChart } from "@/components/charts/FinalsBarChart";
import { RatingBarChart } from "@/components/charts/RatingBarChart";
import { RatingLineChart } from "@/components/charts/RatingLineChart";
import { RecencyScoreChart } from "@/components/charts/RecencyScoreChart";
import { TitlesBarChart } from "@/components/charts/TitlesBarChart";
import { TitlesPieChart } from "@/components/charts/TitlesPieChart";
import { TitlesVsFinalsScatter } from "@/components/charts/TitlesVsFinalsScatter";
import { HistoryTable } from "@/components/dashboard/HistoryTable";
import { ModelControls } from "@/components/dashboard/ModelControls";
import { RatingTable } from "@/components/dashboard/RatingTable";
import { StatCounters } from "@/components/dashboard/StatCounters";
import { TopNations } from "@/components/dashboard/TopNations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-4"
      >
        <Badge>Recent-results Elo experiment</Badge>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          World Cup Predictor
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Predict World Cup matchups from verified recent results first, with
          historical finals data kept only as optional background context.
        </p>
      </motion.section>

      <Card className="border-emerald-400/20 bg-emerald-400/5">
        <CardHeader>
          <CardTitle className="text-emerald-200">
            Recent real results drive accuracy
          </CardTitle>
          <CardDescription className="text-emerald-100/70">
            Winner and runner-up points from 1930–2022 finals are interesting
            for charts, but they do not track current tournament outcomes well.
            The default model replays 2024–2026 competitive matches as Elo
            updates — that is what flips France below Spain and England.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-emerald-100/80">
          Primary: recent-match Elo · Secondary: squad snapshot on /2026 ·
          Legacy: historical finals scoring (collapsed under Advanced).
        </CardContent>
      </Card>

      <StatCounters />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ModelControls />
        <TopNations />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RatingBarChart />
        <RatingLineChart />
        <TitlesBarChart />
        <FinalsBarChart />
        <TitlesPieChart />
        <TitlesVsFinalsScatter />
      </div>

      <RecencyScoreChart />

      <div className="grid gap-6 xl:grid-cols-2">
        <HistoryTable />
        <RatingTable />
      </div>
    </div>
  );
}
