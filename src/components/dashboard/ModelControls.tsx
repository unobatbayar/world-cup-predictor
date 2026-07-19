"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelSettings } from "@/context/ModelSettingsContext";

export function ModelControls() {
  const {
    settings,
    setWinnerPoints,
    setRunnerUpPoints,
    setRecencyDivisor,
    setWeightMode,
  } = useModelSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive model controls</CardTitle>
        <CardDescription>
          Adjust scoring weights to instantly recompute every historical rating.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Control
          label="Winner points"
          display={settings.winnerPoints.toFixed(1)}
        >
          <Slider
            min={0}
            max={10}
            step={0.5}
            value={[settings.winnerPoints]}
            onValueChange={([value]) => setWinnerPoints(value)}
          />
        </Control>

        <Control
          label="Runner-up points"
          display={settings.runnerUpPoints.toFixed(1)}
        >
          <Slider
            min={0}
            max={5}
            step={0.5}
            value={[settings.runnerUpPoints]}
            onValueChange={([value]) => setRunnerUpPoints(value)}
          />
        </Control>

        <Control
          label="Recency multiplier"
          display={settings.recencyDivisor.toFixed(0)}
          hint="Lower values emphasize recent tournaments more aggressively (linear mode)."
        >
          <Slider
            min={40}
            max={200}
            step={5}
            value={[settings.recencyDivisor]}
            onValueChange={([value]) => setRecencyDivisor(value)}
          />
        </Control>

        <div className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <Checkbox
            id="exp-weight"
            checked={settings.weightMode === "exponential"}
            onCheckedChange={(checked) =>
              setWeightMode(checked === true ? "exponential" : "linear")
            }
          />
          <div className="space-y-1">
            <Label htmlFor="exp-weight">Use Exponential Recency Weighting</Label>
            <p className="text-xs text-slate-400">
              Linear: <code>1 + (year - 1930) / divisor</code>. Exponential:{" "}
              <code>exp((year - 1930) / 150)</code>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Control({
  label,
  display,
  hint,
  children,
}: {
  label: string;
  display: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <span className="rounded-md bg-slate-800 px-2 py-1 font-mono text-xs text-emerald-300">
          {display}
        </span>
      </div>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
