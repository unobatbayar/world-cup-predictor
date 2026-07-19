"use client";

import { worldCups } from "@/data/worldcups";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTeamModal } from "@/context/TeamModalContext";
import { normalizeTeam } from "@/lib/ratings";

export function HistoryTable() {
  const { openTeam } = useTeamModal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>World Cup history</CardTitle>
        <CardDescription>
          Every FIFA World Cup final from 1930 through 2022. Click a nation to
          inspect its record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 pr-4 font-medium">Year</th>
                <th className="pb-3 pr-4 font-medium">Host</th>
                <th className="pb-3 pr-4 font-medium">Winner</th>
                <th className="pb-3 font-medium">Runner-up</th>
              </tr>
            </thead>
            <tbody>
              {[...worldCups].reverse().map((cup) => (
                <tr
                  key={cup.year}
                  className="border-b border-slate-800/70 last:border-0"
                >
                  <td className="py-3 pr-4 font-medium text-slate-100">
                    {cup.year}
                  </td>
                  <td className="py-3 pr-4 text-slate-300">{cup.host}</td>
                  <td className="py-3 pr-4">
                    <button
                      type="button"
                      onClick={() => openTeam(normalizeTeam(cup.winner))}
                      className="font-medium text-emerald-300 hover:underline"
                    >
                      {normalizeTeam(cup.winner)}
                      {cup.winner === "West Germany" ? " *" : ""}
                    </button>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => openTeam(normalizeTeam(cup.runnerUp))}
                      className="text-slate-200 hover:underline"
                    >
                      {normalizeTeam(cup.runnerUp)}
                      {cup.runnerUp === "West Germany" ? " *" : ""}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          * West Germany results are merged into Germany during rating
          calculations.
        </p>
      </CardContent>
    </Card>
  );
}
