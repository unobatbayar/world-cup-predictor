import { recentMatches } from "@/data/recentMatches";
import { calculateProbability } from "@/lib/probability";
import type { MatchResult } from "@/lib/types";

export const BASE_RATING = 1500;

/**
 * Replays real competitive results chronologically as Elo updates on top of
 * the historical scaled ratings. Teams without a World Cup finals history
 * start from the 1500 baseline. Draws (including penalty shootouts) count
 * as half a win for each side.
 */
export function applyRecentForm(
  baseRatings: Record<string, number>,
  matches: MatchResult[] = recentMatches
): Record<string, number> {
  const ratings: Record<string, number> = { ...baseRatings };

  const sorted = [...matches].sort((a, b) => a.date.localeCompare(b.date));

  for (const match of sorted) {
    const ratingA = ratings[match.teamA] ?? BASE_RATING;
    const ratingB = ratings[match.teamB] ?? BASE_RATING;

    const { probabilityA: expectedA } = calculateProbability(ratingA, ratingB);
    const actualA =
      match.winner === null ? 0.5 : match.winner === match.teamA ? 1 : 0;

    const delta = match.importance * (actualA - expectedA);
    ratings[match.teamA] = ratingA + delta;
    ratings[match.teamB] = ratingB - delta;
  }

  return ratings;
}

export function getRecentTeamMatches(
  team: string,
  matches: MatchResult[] = recentMatches
): MatchResult[] {
  return matches
    .filter((match) => match.teamA === team || match.teamB === team)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function describeMatchOutcome(
  match: MatchResult,
  team: string
): "win" | "loss" | "draw" {
  if (match.winner === null) return "draw";
  return match.winner === team ? "win" : "loss";
}
