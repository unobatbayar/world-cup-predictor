import { worldCups } from "@/data/worldcups";
import { explainPrediction } from "@/lib/explain";
import { calculateProbabilityFromTeams } from "@/lib/probability";
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

export function predictMatch(
  teamA: string,
  teamB: string,
  settings: ModelSettings = DEFAULT_SETTINGS,
  tournaments: WorldCupTournament[] = worldCups
): PredictionResult {
  const { ratings } = calculateRatings(tournaments, settings);
  const ratingA = ratings.find((r) => r.team === normalizeTeam(teamA));
  const ratingB = ratings.find((r) => r.team === normalizeTeam(teamB));
  const { probabilityA, probabilityB } = calculateProbabilityFromTeams(
    ratingA,
    ratingB
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
  };
}

export function getPredictionExplanation(result: PredictionResult): string {
  return explainPrediction(result.statsA, result.statsB);
}
