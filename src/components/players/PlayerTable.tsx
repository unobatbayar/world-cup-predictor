"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ratePlayers } from "@/lib/players";

export function PlayerTable() {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [position, setPosition] = useState("all");

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ratePlayers().filter(
      (player) =>
        (team === "all" || player.team === team) &&
        (position === "all" || player.position === position) &&
        (!normalizedQuery ||
          player.name.toLowerCase().includes(normalizedQuery) ||
          player.club.toLowerCase().includes(normalizedQuery))
    );
  }, [position, query, team]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finalist player ratings</CardTitle>
        <CardDescription>
          Every player in the static Argentina and Spain dataset, ranked by the
          experimental composite score.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_150px]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search player or club…"
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger aria-label="Filter by team">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teams</SelectItem>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
            </SelectContent>
          </Select>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger aria-label="Filter by position">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All positions</SelectItem>
              <SelectItem value="GK">Goalkeepers</SelectItem>
              <SelectItem value="DEF">Defenders</SelectItem>
              <SelectItem value="MID">Midfielders</SelectItem>
              <SelectItem value="FWD">Forwards</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 pr-3 font-medium">#</th>
                <th className="pb-3 pr-3 font-medium">Player</th>
                <th className="pb-3 pr-3 font-medium">Team</th>
                <th className="pb-3 pr-3 font-medium">Pos</th>
                <th className="pb-3 pr-3 font-medium">Age</th>
                <th className="pb-3 pr-3 font-medium">Club</th>
                <th className="pb-3 pr-3 text-right font-medium">Form</th>
                <th className="pb-3 pr-3 text-right font-medium">Intl.</th>
                <th className="pb-3 pr-3 text-right font-medium">Exp.</th>
                <th className="pb-3 pr-3 text-right font-medium">Avail.</th>
                <th className="pb-3 text-right font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, index) => (
                <tr
                  key={player.id}
                  className="border-b border-slate-800/70 last:border-0"
                >
                  <td className="py-3 pr-3 text-slate-500">{index + 1}</td>
                  <td className="py-3 pr-3 font-medium text-slate-100">
                    {player.name}
                  </td>
                  <td className="py-3 pr-3">
                    <Badge
                      className={
                        player.team === "Spain"
                          ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                          : undefined
                      }
                    >
                      {player.team}
                    </Badge>
                  </td>
                  <td className="py-3 pr-3 text-slate-300">
                    {player.position}
                  </td>
                  <td className="py-3 pr-3 text-slate-300">{player.age}</td>
                  <td className="py-3 pr-3 text-slate-300">{player.club}</td>
                  <Metric value={player.form} />
                  <Metric value={player.internationalPerformance} />
                  <Metric value={player.experience} />
                  <Metric value={player.availability} />
                  <td className="py-3 text-right font-mono font-semibold text-emerald-300">
                    {player.rating.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">
          Showing {filteredPlayers.length} players. Ratings are illustrative
          model inputs, not official ratings or confirmed 2026 squad selections.
        </p>
      </CardContent>
    </Card>
  );
}

function Metric({ value }: { value: number }) {
  return (
    <td className="py-3 pr-3 text-right font-mono text-slate-300">{value}</td>
  );
}
