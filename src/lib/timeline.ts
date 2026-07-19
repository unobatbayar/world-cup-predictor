import { worldCups } from "@/data/worldcups";
import { normalizeTeam } from "@/lib/ratings";
import type { TimelineEvent, WorldCupTournament } from "@/lib/types";

export function buildTimeline(
  team: string,
  tournaments: WorldCupTournament[] = worldCups
): TimelineEvent[] {
  const normalized = normalizeTeam(team);

  return tournaments
    .slice()
    .sort((a, b) => a.year - b.year)
    .map((cup) => {
      const winner = normalizeTeam(cup.winner);
      const runnerUp = normalizeTeam(cup.runnerUp);

      if (winner === normalized) {
        return {
          year: cup.year,
          host: cup.host,
          role: "winner" as const,
          opponent: runnerUp,
        };
      }

      if (runnerUp === normalized) {
        return {
          year: cup.year,
          host: cup.host,
          role: "runnerUp" as const,
          opponent: winner,
        };
      }

      return {
        year: cup.year,
        host: cup.host,
        role: "neither" as const,
      };
    });
}

export function buildTeamFinalsTimeline(
  team: string,
  tournaments: WorldCupTournament[] = worldCups
): TimelineEvent[] {
  return buildTimeline(team, tournaments).filter(
    (event) => event.role !== "neither"
  );
}
