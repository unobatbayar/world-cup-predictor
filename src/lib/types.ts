export type WorldCupTournament = {
  year: number;
  host: string;
  winner: string;
  runnerUp: string;
};

export type WeightMode = "linear" | "exponential";

export type ModelSettings = {
  winnerPoints: number;
  runnerUpPoints: number;
  recencyDivisor: number;
  weightMode: WeightMode;
};

export type TeamRating = {
  team: string;
  score: number;
  scaledRating: number;
  titles: number;
  runnerUps: number;
  finals: number;
  yearsWon: number[];
  yearsRunnerUp: number[];
};

export type RatingSnapshot = {
  year: number;
  ratings: Record<string, number>;
};

export type TimelineEvent = {
  year: number;
  host: string;
  role: "winner" | "runnerUp" | "neither";
  opponent?: string;
};

export type TeamStats = {
  team: string;
  titles: number;
  runnerUps: number;
  finals: number;
  yearsWon: number[];
  yearsRunnerUp: number[];
  score: number;
  scaledRating: number;
  timeline: TimelineEvent[];
};

export type PredictionResult = {
  teamA: string;
  teamB: string;
  probabilityA: number;
  probabilityB: number;
  predictedWinner: string;
  statsA: TeamStats;
  statsB: TeamStats;
};

export type PlayerPosition = "GK" | "DEF" | "MID" | "FWD";

export type Player = {
  id: string;
  name: string;
  team: "Argentina" | "Spain";
  position: PlayerPosition;
  age: number;
  club: string;
  form: number;
  internationalPerformance: number;
  experience: number;
  availability: number;
};

export type RatedPlayer = Player & {
  rating: number;
};

export type PlayerTeamStrength = {
  team: string;
  startingXI: RatedPlayer[];
  squad: RatedPlayer[];
  startingXIRating: number;
  depthRating: number;
  playerRating: number;
  playerScaledRating: number;
};

export type CombinedPredictionResult = PredictionResult & {
  historicalWeight: number;
  playerWeight: number;
  playerStrengthA: PlayerTeamStrength;
  playerStrengthB: PlayerTeamStrength;
  combinedRatingA: number;
  combinedRatingB: number;
  historicalProbabilityA: number;
  historicalProbabilityB: number;
};
