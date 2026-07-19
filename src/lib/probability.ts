import type { TeamRating } from "@/lib/types";

export function scaleRating(score: number): number {
  return 1500 + score * 40;
}

export function calculateProbability(
  ratingA: number,
  ratingB: number
): { probabilityA: number; probabilityB: number } {
  const probabilityA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  return {
    probabilityA,
    probabilityB: 1 - probabilityA,
  };
}

export function calculateProbabilityFromTeams(
  teamA: TeamRating | undefined,
  teamB: TeamRating | undefined
): { probabilityA: number; probabilityB: number } {
  const ratingA = teamA?.scaledRating ?? 1500;
  const ratingB = teamB?.scaledRating ?? 1500;
  return calculateProbability(ratingA, ratingB);
}
