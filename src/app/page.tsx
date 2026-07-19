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
        <Badge>Historical analytics experiment</Badge>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          World Cup Predictor
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Predict the next FIFA World Cup champion using only historical World
          Cup results.
        </p>
      </motion.section>

      <Card className="border-amber-400/20 bg-amber-400/5">
        <CardHeader>
          <CardTitle className="text-amber-200">Not a betting model</CardTitle>
          <CardDescription className="text-amber-100/70">
            This is a playful data-science experiment. Ratings are derived only
            from historical World Cup winners and runners-up, with optional
            recency weighting. They are not intended for gambling, scouting, or
            serious forecasting.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-amber-100/80">
          Winner: +3 × weight · Runner-up: +1 × weight · Weight grows with
          tournament year so recent finals matter more.
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
