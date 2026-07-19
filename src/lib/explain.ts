import type { TeamStats } from "@/lib/types";

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function explainPrediction(statsA: TeamStats, statsB: TeamStats): string {
  const [leading, trailing] =
    statsA.score >= statsB.score ? [statsA, statsB] : [statsB, statsA];

  const leadingRecent = leading.yearsWon.filter((y) => y >= 2000).length;
  const trailingRecent = trailing.yearsWon.filter((y) => y >= 2000).length;

  const leadingRecentText =
    leadingRecent > 0
      ? ` and has benefited from strong recent performances`
      : leading.yearsWon.length > 0
        ? ` spanning decades of finals experience`
        : "";

  const trailingClause =
    trailing.titles === 0
      ? `${trailing.team} has never won the World Cup and has fewer historical finals appearances`
      : `${trailing.team} has ${pluralize(trailing.titles, "World Cup title")} and fewer historical finals appearances`;

  return `${leading.team} has won ${pluralize(leading.titles, "World Cup")}, reached ${pluralize(leading.finals, "final")},${leadingRecentText}. ${trailingClause}, resulting in a lower historical rating${
    leadingRecent > trailingRecent ? " despite competitive modern form" : ""
  }.`;
}

export function explainMatchupSummary(
  statsA: TeamStats,
  statsB: TeamStats,
  predictedWinner: string
): string {
  const winner = predictedWinner === statsA.team ? statsA : statsB;
  const loser = predictedWinner === statsA.team ? statsB : statsA;

  return `${winner.team} has accumulated a stronger historical rating due to ${pluralize(
    winner.titles,
    "World Cup title"
  )} and ${pluralize(winner.finals, "finals appearance")}. ${loser.team} trails with a recency-weighted score of ${loser.score.toFixed(
    2
  )} versus ${winner.score.toFixed(2)}.`;
}
