import type { MatchResult } from "@/lib/types";

// Real competitive results from mid-2024 through the 2026 World Cup
// (excluding the 2026 final itself, which is what the app predicts).
// `winner: null` means the match is treated as a draw for Elo purposes
// (including games decided on penalties).
// `importance` is the Elo K-factor applied to the match.
export const recentMatches: MatchResult[] = [
  // Euro 2024
  { date: "2024-07-05", competition: "Euro 2024", stage: "Quarter-final", teamA: "Spain", teamB: "Germany", scoreA: 2, scoreB: 1, winner: "Spain", importance: 100 },
  { date: "2024-07-05", competition: "Euro 2024", stage: "Quarter-final", teamA: "France", teamB: "Portugal", scoreA: 0, scoreB: 0, winner: null, importance: 100 },
  { date: "2024-07-06", competition: "Euro 2024", stage: "Quarter-final", teamA: "England", teamB: "Switzerland", scoreA: 1, scoreB: 1, winner: null, importance: 100 },
  { date: "2024-07-09", competition: "Euro 2024", stage: "Semi-final", teamA: "Spain", teamB: "France", scoreA: 2, scoreB: 1, winner: "Spain", importance: 100 },
  { date: "2024-07-10", competition: "Euro 2024", stage: "Semi-final", teamA: "England", teamB: "Netherlands", scoreA: 2, scoreB: 1, winner: "England", importance: 100 },
  { date: "2024-07-14", competition: "Euro 2024", stage: "Final", teamA: "Spain", teamB: "England", scoreA: 2, scoreB: 1, winner: "Spain", importance: 100 },

  // Copa América 2024
  { date: "2024-07-14", competition: "Copa América 2024", stage: "Final", teamA: "Argentina", teamB: "Colombia", scoreA: 1, scoreB: 0, winner: "Argentina", importance: 100 },

  // UEFA Nations League 2025
  { date: "2025-06-05", competition: "Nations League 2025", stage: "Semi-final", teamA: "Spain", teamB: "France", scoreA: 5, scoreB: 4, winner: "Spain", importance: 80 },
  { date: "2025-06-08", competition: "Nations League 2025", stage: "Final", teamA: "Portugal", teamB: "Spain", scoreA: 2, scoreB: 2, winner: null, importance: 80 },

  // FIFA World Cup 2026 knockout stage
  { date: "2026-06-29", competition: "World Cup 2026", stage: "Round of 32", teamA: "France", teamB: "Sweden", scoreA: 3, scoreB: 0, winner: "France", importance: 120 },
  { date: "2026-07-03", competition: "World Cup 2026", stage: "Round of 16", teamA: "Argentina", teamB: "Egypt", scoreA: null, scoreB: null, winner: "Argentina", importance: 120 },
  { date: "2026-07-04", competition: "World Cup 2026", stage: "Round of 16", teamA: "Norway", teamB: "Brazil", scoreA: 2, scoreB: 1, winner: "Norway", importance: 120 },
  { date: "2026-07-04", competition: "World Cup 2026", stage: "Round of 16", teamA: "Paraguay", teamB: "France", scoreA: 0, scoreB: 1, winner: "France", importance: 120 },
  { date: "2026-07-04", competition: "World Cup 2026", stage: "Round of 16", teamA: "Canada", teamB: "Morocco", scoreA: 0, scoreB: 3, winner: "Morocco", importance: 120 },
  { date: "2026-07-09", competition: "World Cup 2026", stage: "Quarter-final", teamA: "France", teamB: "Morocco", scoreA: 2, scoreB: 0, winner: "France", importance: 120 },
  { date: "2026-07-10", competition: "World Cup 2026", stage: "Quarter-final", teamA: "Spain", teamB: "Belgium", scoreA: null, scoreB: null, winner: "Spain", importance: 120 },
  { date: "2026-07-10", competition: "World Cup 2026", stage: "Quarter-final", teamA: "Norway", teamB: "England", scoreA: null, scoreB: null, winner: "England", importance: 120 },
  { date: "2026-07-11", competition: "World Cup 2026", stage: "Quarter-final", teamA: "Argentina", teamB: "Switzerland", scoreA: null, scoreB: null, winner: "Argentina", importance: 120 },
  { date: "2026-07-14", competition: "World Cup 2026", stage: "Semi-final", teamA: "France", teamB: "Spain", scoreA: 0, scoreB: 2, winner: "Spain", importance: 120 },
  { date: "2026-07-15", competition: "World Cup 2026", stage: "Semi-final", teamA: "England", teamB: "Argentina", scoreA: 1, scoreB: 2, winner: "Argentina", importance: 120 },
  { date: "2026-07-18", competition: "World Cup 2026", stage: "Third place", teamA: "France", teamB: "England", scoreA: 4, scoreB: 6, winner: "England", importance: 120 },
];
