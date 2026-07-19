import { recentMatches } from "@/data/recentMatches";
import { worldCups } from "@/data/worldcups";
import type {
  MatchResult,
  ModelSettings,
  RatingSnapshot,
  TeamRating,
  WeightMode,
  WorldCupTournament,
} from "@/lib/types";

export const DEFAULT_SETTINGS: ModelSettings = {
  winnerPoints: 3,
  runnerUpPoints: 1,
  recencyDivisor: 100,
  weightMode: "linear",
  useRecentForm: true,
  formWeight: 1,
};

export function normalizeTeam(name: string): string {
  if (name === "West Germany") return "Germany";
  return name;
}

export function getRecencyWeight(
  year: number,
  divisor: number,
  mode: WeightMode
): number {
  const age = year - 1930;
  if (mode === "exponential") {
    return Math.exp(age / 150);
  }
  return 1 + age / divisor;
}

export function calculateRatings(
  tournaments: WorldCupTournament[] = worldCups,
  settings: ModelSettings = DEFAULT_SETTINGS
): {
  ratings: TeamRating[];
  snapshots: RatingSnapshot[];
  scores: Record<string, number>;
} {
  const scores: Record<string, number> = {};
  const titles: Record<string, number> = {};
  const runnerUps: Record<string, number> = {};
  const yearsWon: Record<string, number[]> = {};
  const yearsRunnerUp: Record<string, number[]> = {};
  const snapshots: RatingSnapshot[] = [];

  const ensure = (team: string) => {
    if (!(team in scores)) {
      scores[team] = 0;
      titles[team] = 0;
      runnerUps[team] = 0;
      yearsWon[team] = [];
      yearsRunnerUp[team] = [];
    }
  };

  for (const cup of [...tournaments].sort((a, b) => a.year - b.year)) {
    const winner = normalizeTeam(cup.winner);
    const runnerUp = normalizeTeam(cup.runnerUp);
    ensure(winner);
    ensure(runnerUp);

    const weight = getRecencyWeight(
      cup.year,
      settings.recencyDivisor,
      settings.weightMode
    );

    scores[winner] += settings.winnerPoints * weight;
    scores[runnerUp] += settings.runnerUpPoints * weight;
    titles[winner] += 1;
    runnerUps[runnerUp] += 1;
    yearsWon[winner].push(cup.year);
    yearsRunnerUp[runnerUp].push(cup.year);

    snapshots.push({
      year: cup.year,
      ratings: { ...scores },
    });
  }

  const ratings: TeamRating[] = Object.keys(scores)
    .map((team) => ({
      team,
      score: scores[team],
      scaledRating: 1500 + scores[team] * 40,
      titles: titles[team],
      runnerUps: runnerUps[team],
      finals: titles[team] + runnerUps[team],
      yearsWon: yearsWon[team],
      yearsRunnerUp: yearsRunnerUp[team],
    }))
    .sort((a, b) => b.score - a.score || a.team.localeCompare(b.team));

  return { ratings, snapshots, scores };
}

export function getAllTeams(
  tournaments: WorldCupTournament[] = worldCups,
  matches: MatchResult[] = recentMatches
): string[] {
  const teams = new Set<string>();
  for (const cup of tournaments) {
    teams.add(normalizeTeam(cup.winner));
    teams.add(normalizeTeam(cup.runnerUp));
  }
  for (const match of matches) {
    teams.add(normalizeTeam(match.teamA));
    teams.add(normalizeTeam(match.teamB));
  }
  return [...teams].sort((a, b) => a.localeCompare(b));
}
