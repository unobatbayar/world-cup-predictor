import { worldCups } from "@/data/worldcups";
import { normalizeTeam } from "@/lib/ratings";
import type { WorldCupTournament } from "@/lib/types";

export function calculateTitles(
  team: string,
  tournaments: WorldCupTournament[] = worldCups
): number {
  const normalized = normalizeTeam(team);
  return tournaments.filter((cup) => normalizeTeam(cup.winner) === normalized)
    .length;
}

export function calculateRunnerUps(
  team: string,
  tournaments: WorldCupTournament[] = worldCups
): number {
  const normalized = normalizeTeam(team);
  return tournaments.filter(
    (cup) => normalizeTeam(cup.runnerUp) === normalized
  ).length;
}

export function calculateTitleShares(
  tournaments: WorldCupTournament[] = worldCups
): { team: string; titles: number }[] {
  const counts: Record<string, number> = {};
  for (const cup of tournaments) {
    const winner = normalizeTeam(cup.winner);
    counts[winner] = (counts[winner] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([team, titles]) => ({ team, titles }))
    .sort((a, b) => b.titles - a.titles || a.team.localeCompare(b.team));
}

export function calculateFinalsAppearances(
  tournaments: WorldCupTournament[] = worldCups
): { team: string; finals: number; titles: number; runnerUps: number }[] {
  const map: Record<
    string,
    { finals: number; titles: number; runnerUps: number }
  > = {};

  for (const cup of tournaments) {
    const winner = normalizeTeam(cup.winner);
    const runnerUp = normalizeTeam(cup.runnerUp);

    if (!map[winner]) map[winner] = { finals: 0, titles: 0, runnerUps: 0 };
    if (!map[runnerUp]) map[runnerUp] = { finals: 0, titles: 0, runnerUps: 0 };

    map[winner].titles += 1;
    map[winner].finals += 1;
    map[runnerUp].runnerUps += 1;
    map[runnerUp].finals += 1;
  }

  return Object.entries(map)
    .map(([team, stats]) => ({ team, ...stats }))
    .sort((a, b) => b.finals - a.finals || a.team.localeCompare(b.team));
}
