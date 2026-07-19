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
    setUseRecentForm,
    setFormWeight,
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

        <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="recent-form"
              checked={settings.useRecentForm}
              onCheckedChange={(checked) =>
                setUseRecentForm(checked === true)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="recent-form">Use Recent Real Results</Label>
              <p className="text-xs text-slate-400">
                Replays 2024–2026 competitive results (Euro 2024, Copa América,
                Nations League, 2026 World Cup knockouts) as Elo updates on top
                of the historical rating.
              </p>
            </div>
          </div>
          {settings.useRecentForm ? (
            <Control
              label="Form influence"
              display={`${Math.round(settings.formWeight * 100)}%`}
              hint="0% = history only, 100% = full Elo adjustment from recent matches."
            >
              <Slider
                min={0}
                max={1}
                step={0.05}
                value={[settings.formWeight]}
                onValueChange={([value]) => setFormWeight(value)}
              />
            </Control>
          ) : null}
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
