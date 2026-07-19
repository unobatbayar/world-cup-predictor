import { players } from "@/data/players";
import { calculateProbability } from "@/lib/probability";
import { predictMatch } from "@/lib/predict";
import type {
  CombinedPredictionResult,
  ModelSettings,
  Player,
  PlayerPosition,
  PlayerTeamStrength,
  RatedPlayer,
} from "@/lib/types";

export const PLAYER_SCORE_WEIGHTS = {
  form: 0.4,
  internationalPerformance: 0.3,
  experience: 0.2,
  availability: 0.1,
} as const;

const STARTING_XI_SHAPE: Record<PlayerPosition, number> = {
  GK: 1,
  DEF: 4,
  MID: 3,
  FWD: 3,
};

export function calculatePlayerRating(player: Player): number {
  return (
    player.form * PLAYER_SCORE_WEIGHTS.form +
    player.internationalPerformance *
      PLAYER_SCORE_WEIGHTS.internationalPerformance +
    player.experience * PLAYER_SCORE_WEIGHTS.experience +
    player.availability * PLAYER_SCORE_WEIGHTS.availability
  );
}

export function ratePlayers(squad: Player[] = players): RatedPlayer[] {
  return squad
    .map((player) => ({
      ...player,
      rating: calculatePlayerRating(player),
    }))
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
}

function average(values: number[]): number {
  return values.length
    ? values.reduce((total, value) => total + value, 0) / values.length
    : 0;
}

export function calculatePlayerTeamStrength(
  team: string,
  squad: Player[] = players
): PlayerTeamStrength {
  const ratedSquad = ratePlayers(
    squad.filter((player) => player.team === team)
  );

  const startingXI = (
    Object.entries(STARTING_XI_SHAPE) as [PlayerPosition, number][]
  ).flatMap(([position, count]) =>
    ratedSquad.filter((player) => player.position === position).slice(0, count)
  );

  const startingXIRating = average(startingXI.map((player) => player.rating));
  const depthRating = average(ratedSquad.map((player) => player.rating));
  const playerRating = startingXIRating * 0.85 + depthRating * 0.15;

  return {
    team,
    startingXI,
    squad: ratedSquad,
    startingXIRating,
    depthRating,
    playerRating,
    playerScaledRating: 1500 + (playerRating - 75) * 20,
  };
}

export function predict2026Match(
  teamA: string,
  teamB: string,
  settings: ModelSettings,
  historicalWeight = 0.6
): CombinedPredictionResult {
  const historical = predictMatch(teamA, teamB, settings);
  const playerWeight = 1 - historicalWeight;
  const playerStrengthA = calculatePlayerTeamStrength(teamA);
  const playerStrengthB = calculatePlayerTeamStrength(teamB);
  // effectiveRating already folds in recent real results when enabled.
  const combinedRatingA =
    historical.effectiveRatingA * historicalWeight +
    playerStrengthA.playerScaledRating * playerWeight;
  const combinedRatingB =
    historical.effectiveRatingB * historicalWeight +
    playerStrengthB.playerScaledRating * playerWeight;
  const { probabilityA, probabilityB } = calculateProbability(
    combinedRatingA,
    combinedRatingB
  );

  return {
    ...historical,
    probabilityA,
    probabilityB,
    predictedWinner: probabilityA >= probabilityB ? teamA : teamB,
    historicalWeight,
    playerWeight,
    playerStrengthA,
    playerStrengthB,
    combinedRatingA,
    combinedRatingB,
    historicalProbabilityA: historical.probabilityA,
    historicalProbabilityB: historical.probabilityB,
  };
}

export function explainCombinedPrediction(
  result: CombinedPredictionResult
): string {
  const strongerPlayers =
    result.playerStrengthA.playerRating >= result.playerStrengthB.playerRating
      ? result.playerStrengthA
      : result.playerStrengthB;
  const historicalLeader =
    result.statsA.scaledRating >= result.statsB.scaledRating
      ? result.teamA
      : result.teamB;

  return `${result.predictedWinner} leads the blended model. ${historicalLeader} has the stronger historical rating, while ${strongerPlayers.team} has the higher experimental squad score (${strongerPlayers.playerRating.toFixed(1)}). The final probability weights World Cup history ${Math.round(result.historicalWeight * 100)}% and player form, international performance, experience, and availability ${Math.round(result.playerWeight * 100)}%.`;
}
