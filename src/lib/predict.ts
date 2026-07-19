import { worldCups } from "@/data/worldcups";
import { explainPrediction } from "@/lib/explain";
import { applyRecentForm } from "@/lib/form";
import { calculateProbability } from "@/lib/probability";
import {
  calculateRatings,
  DEFAULT_SETTINGS,
  normalizeTeam,
} from "@/lib/ratings";
import { buildTimeline } from "@/lib/timeline";
import type {
  ModelSettings,
  PredictionResult,
  TeamRating,
  TeamStats,
  WorldCupTournament,
} from "@/lib/types";

export function toTeamStats(
  rating: TeamRating | undefined,
  team: string,
  tournaments: WorldCupTournament[] = worldCups
): TeamStats {
  const normalized = normalizeTeam(team);
  return {
    team: normalized,
    titles: rating?.titles ?? 0,
    runnerUps: rating?.runnerUps ?? 0,
    finals: rating?.finals ?? 0,
    yearsWon: rating?.yearsWon ?? [],
    yearsRunnerUp: rating?.yearsRunnerUp ?? [],
    score: rating?.score ?? 0,
    scaledRating: rating?.scaledRating ?? 1500,
    timeline: buildTimeline(normalized, tournaments),
  };
}

/**
 * Effective rating = historical rating, optionally shifted toward the
 * form-adjusted rating produced by replaying recent real results as
 * Elo updates. formWeight 0 = history only, 1 = full form adjustment.
 */
export function getEffectiveRatings(
  settings: ModelSettings = DEFAULT_SETTINGS,
  tournaments: WorldCupTournament[] = worldCups
): {
  historical: Record<string, number>;
  effective: Record<string, number>;
} {
  const { ratings } = calculateRatings(tournaments, settings);
  const historical: Record<string, number> = {};
  for (const rating of ratings) {
    historical[rating.team] = rating.scaledRating;
  }

  if (!settings.useRecentForm) {
    return { historical, effective: historical };
  }

  const formAdjusted = applyRecentForm(historical);
  const effective: Record<string, number> = {};
  for (const team of Object.keys(formAdjusted)) {
    const base = historical[team] ?? 1500;
    effective[team] = base + settings.formWeight * (formAdjusted[team] - base);
  }

  return { historical, effective };
}

export function predictMatch(
  teamA: string,
  teamB: string,
  settings: ModelSettings = DEFAULT_SETTINGS,
  tournaments: WorldCupTournament[] = worldCups
): PredictionResult {
  const { ratings } = calculateRatings(tournaments, settings);
  const normalizedA = normalizeTeam(teamA);
  const normalizedB = normalizeTeam(teamB);
  const ratingA = ratings.find((r) => r.team === normalizedA);
  const ratingB = ratings.find((r) => r.team === normalizedB);

  const { historical, effective } = getEffectiveRatings(settings, tournaments);
  const effectiveRatingA =
    effective[normalizedA] ?? historical[normalizedA] ?? 1500;
  const effectiveRatingB =
    effective[normalizedB] ?? historical[normalizedB] ?? 1500;

  const { probabilityA, probabilityB } = calculateProbability(
    effectiveRatingA,
    effectiveRatingB
  );

  const statsA = toTeamStats(ratingA, teamA, tournaments);
  const statsB = toTeamStats(ratingB, teamB, tournaments);

  return {
    teamA: statsA.team,
    teamB: statsB.team,
    probabilityA,
    probabilityB,
    predictedWinner:
      probabilityA === probabilityB
        ? statsA.score >= statsB.score
          ? statsA.team
          : statsB.team
        : probabilityA > probabilityB
          ? statsA.team
          : statsB.team,
    statsA,
    statsB,
    formRatingA: effectiveRatingA,
    formRatingB: effectiveRatingB,
    effectiveRatingA,
    effectiveRatingB,
    formWeight: settings.useRecentForm ? settings.formWeight : 0,
  };
}

export function getPredictionExplanation(result: PredictionResult): string {
  return explainPrediction(result.statsA, result.statsB);
}
