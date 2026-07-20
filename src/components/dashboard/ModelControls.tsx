"use client";

import { useState, type ReactNode } from "react";
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
  const [showLegacy, setShowLegacy] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction model</CardTitle>
        <CardDescription>
          Recent real-match Elo drives the forecasts. Historical winner and
          runner-up points are optional background context only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
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
                Primary signal. Replays verified 2024–2026 competitive matches
                (Euro 2024, Copa América, Nations League, World Cup 2026) as
                Elo updates. This is what makes Spain beat France and England
                beat France in the model.
              </p>
            </div>
          </div>
          {settings.useRecentForm ? (
            <Control
              label="Form influence"
              display={`${Math.round(settings.formWeight * 100)}%`}
              hint="Keep near 100% for the most accurate live forecasts. Lower values drift back toward old finals pedigree."
            >
              <Slider
                min={0}
                max={1}
                step={0.05}
                value={[settings.formWeight]}
                onValueChange={([value]) => setFormWeight(value)}
              />
            </Control>
          ) : (
            <p className="rounded-md border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs text-amber-100/80">
              Recent form is off. Predictions fall back to historical finals
              scoring, which overrates teams like France relative to current
              tournament results.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={() => setShowLegacy((open) => !open)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-300 hover:text-white"
          >
            <span>Advanced: historical finals scoring</span>
            <span className="font-mono text-xs text-slate-500">
              {showLegacy ? "Hide" : "Show"}
            </span>
          </button>
          {showLegacy ? (
            <div className="space-y-6 border-t border-slate-800 px-4 py-4">
              <p className="text-xs text-slate-500">
                These knobs only affect the pre-form baseline from 1930–2022
                World Cup finals. They usually do not improve head-to-head
                accuracy once recent Elo is enabled.
              </p>
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
                hint="Only used for the historical finals baseline."
              >
                <Slider
                  min={40}
                  max={200}
                  step={5}
                  value={[settings.recencyDivisor]}
                  onValueChange={([value]) => setRecencyDivisor(value)}
                />
              </Control>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="exp-weight"
                  checked={settings.weightMode === "exponential"}
                  onCheckedChange={(checked) =>
                    setWeightMode(checked === true ? "exponential" : "linear")
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="exp-weight">
                    Exponential finals weighting
                  </Label>
                  <p className="text-xs text-slate-400">
                    Optional alternate curve for the historical baseline only.
                  </p>
                </div>
              </div>
            </div>
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
