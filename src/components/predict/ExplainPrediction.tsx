"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPredictionExplanation } from "@/lib/predict";
import type { PredictionResult } from "@/lib/types";

type ExplainPredictionProps = {
  result: PredictionResult;
};

export function ExplainPrediction({ result }: ExplainPredictionProps) {
  const explanation = getPredictionExplanation(result);

  return (
    <Card className="border-amber-500/20">
      <CardHeader>
        <CardTitle>Explain prediction</CardTitle>
        <CardDescription>
          Generated from computed titles, finals, and recency-weighted scores —
          not a hardcoded blurb.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <blockquote className="border-l-2 border-amber-400/60 pl-4 text-base leading-relaxed text-slate-200">
          {explanation}
        </blockquote>
      </CardContent>
    </Card>
  );
}
