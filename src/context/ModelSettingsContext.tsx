"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { worldCups } from "@/data/worldcups";
import { calculateRatings, DEFAULT_SETTINGS, getAllTeams } from "@/lib/ratings";
import { getEffectiveRatings } from "@/lib/predict";
import { calculateFinalsAppearances, calculateTitleShares } from "@/lib/stats";
import type { ModelSettings, TeamRating, WeightMode } from "@/lib/types";

export type FormRankedTeam = {
  team: string;
  effectiveRating: number;
  historicalRating: number;
  titles: number;
  runnerUps: number;
  finals: number;
};

type ModelContextValue = {
  settings: ModelSettings;
  setWinnerPoints: (value: number) => void;
  setRunnerUpPoints: (value: number) => void;
  setRecencyDivisor: (value: number) => void;
  setWeightMode: (mode: WeightMode) => void;
  toggleWeightMode: () => void;
  setUseRecentForm: (value: boolean) => void;
  setFormWeight: (value: number) => void;
  ratings: TeamRating[];
  formRankings: FormRankedTeam[];
  snapshots: ReturnType<typeof calculateRatings>["snapshots"];
  teams: string[];
  titleShares: ReturnType<typeof calculateTitleShares>;
  finalsAppearances: ReturnType<typeof calculateFinalsAppearances>;
  tournamentCount: number;
  countryCount: number;
  totalTitles: number;
};

const ModelSettingsContext = createContext<ModelContextValue | null>(null);

export function ModelSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ModelSettings>(DEFAULT_SETTINGS);

  const setWinnerPoints = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, winnerPoints: value }));
  }, []);

  const setRunnerUpPoints = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, runnerUpPoints: value }));
  }, []);

  const setRecencyDivisor = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, recencyDivisor: value }));
  }, []);

  const setWeightMode = useCallback((mode: WeightMode) => {
    setSettings((prev) => ({ ...prev, weightMode: mode }));
  }, []);

  const toggleWeightMode = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      weightMode: prev.weightMode === "linear" ? "exponential" : "linear",
    }));
  }, []);

  const setUseRecentForm = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, useRecentForm: value }));
  }, []);

  const setFormWeight = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, formWeight: value }));
  }, []);

  const { ratings, snapshots } = useMemo(
    () => calculateRatings(worldCups, settings),
    [settings]
  );

  const formRankings = useMemo(() => {
    const { historical, effective } = getEffectiveRatings(settings);
    const titleLookup = Object.fromEntries(
      ratings.map((rating) => [
        rating.team,
        {
          titles: rating.titles,
          runnerUps: rating.runnerUps,
          finals: rating.finals,
        },
      ])
    );

    return Object.keys(effective)
      .map((team) => ({
        team,
        effectiveRating: effective[team],
        historicalRating: historical[team] ?? 1500,
        titles: titleLookup[team]?.titles ?? 0,
        runnerUps: titleLookup[team]?.runnerUps ?? 0,
        finals: titleLookup[team]?.finals ?? 0,
      }))
      .sort(
        (a, b) =>
          b.effectiveRating - a.effectiveRating || a.team.localeCompare(b.team)
      );
  }, [ratings, settings]);

  const teams = useMemo(() => getAllTeams(worldCups), []);
  const titleShares = useMemo(() => calculateTitleShares(worldCups), []);
  const finalsAppearances = useMemo(
    () => calculateFinalsAppearances(worldCups),
    []
  );

  const value = useMemo<ModelContextValue>(
    () => ({
      settings,
      setWinnerPoints,
      setRunnerUpPoints,
      setRecencyDivisor,
      setWeightMode,
      toggleWeightMode,
      setUseRecentForm,
      setFormWeight,
      ratings,
      formRankings,
      snapshots,
      teams,
      titleShares,
      finalsAppearances,
      tournamentCount: worldCups.length,
      countryCount: teams.length,
      totalTitles: worldCups.length,
    }),
    [
      settings,
      setWinnerPoints,
      setRunnerUpPoints,
      setRecencyDivisor,
      setWeightMode,
      toggleWeightMode,
      setUseRecentForm,
      setFormWeight,
      ratings,
      formRankings,
      snapshots,
      teams,
      titleShares,
      finalsAppearances,
    ]
  );

  return (
    <ModelSettingsContext.Provider value={value}>
      {children}
    </ModelSettingsContext.Provider>
  );
}

export function useModelSettings() {
  const context = useContext(ModelSettingsContext);
  if (!context) {
    throw new Error("useModelSettings must be used within ModelSettingsProvider");
  }
  return context;
}
