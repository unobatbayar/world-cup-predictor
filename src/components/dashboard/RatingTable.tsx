"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelSettings } from "@/context/ModelSettingsContext";
import { useTeamModal } from "@/context/TeamModalContext";
import { formatScore } from "@/lib/utils";

export function RatingTable() {
  const { ratings } = useModelSettings();
  const { openTeam } = useTeamModal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating table</CardTitle>
        <CardDescription>
          Recency-weighted historical score for every nation that reached a
          World Cup final.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 pr-3 font-medium">#</th>
                <th className="pb-3 pr-3 font-medium">Nation</th>
                <th className="pb-3 pr-3 font-medium">Score</th>
                <th className="pb-3 pr-3 font-medium">Scaled</th>
                <th className="pb-3 pr-3 font-medium">Titles</th>
                <th className="pb-3 pr-3 font-medium">Runner-ups</th>
                <th className="pb-3 font-medium">Finals</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((team, index) => (
                <tr
                  key={team.team}
                  className="border-b border-slate-800/70 last:border-0"
                >
                  <td className="py-3 pr-3 text-slate-500">{index + 1}</td>
                  <td className="py-3 pr-3">
                    <button
                      type="button"
                      onClick={() => openTeam(team.team)}
                      className="font-medium text-slate-100 hover:text-emerald-300"
                    >
                      {team.team}
                    </button>
                  </td>
                  <td className="py-3 pr-3 font-mono text-emerald-300">
                    {formatScore(team.score)}
                  </td>
                  <td className="py-3 pr-3 font-mono text-slate-300">
                    {Math.round(team.scaledRating)}
                  </td>
                  <td className="py-3 pr-3">{team.titles}</td>
                  <td className="py-3 pr-3">{team.runnerUps}</td>
                  <td className="py-3">{team.finals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
