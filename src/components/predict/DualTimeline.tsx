"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useModelSettings } from "@/context/ModelSettingsContext";
import { buildTeamFinalsTimeline } from "@/lib/timeline";

type DualTimelineProps = {
  teamA: string;
  teamB: string;
};

export function DualTimeline({ teamA, teamB }: DualTimelineProps) {
  const { snapshots } = useModelSettings();

  const chartData = useMemo(
    () =>
      snapshots.map((snapshot) => ({
        year: snapshot.year,
        [teamA]: Number((snapshot.ratings[teamA] ?? 0).toFixed(2)),
        [teamB]: Number((snapshot.ratings[teamB] ?? 0).toFixed(2)),
      })),
    [snapshots, teamA, teamB]
  );

  const eventsA = useMemo(() => buildTeamFinalsTimeline(teamA), [teamA]);
  const eventsB = useMemo(() => buildTeamFinalsTimeline(teamB), [teamB]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Rating timeline</CardTitle>
          <CardDescription>
            Score accumulation for {teamA} and {teamB} across every tournament.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid #334155",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={teamA}
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={teamB}
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Finals timeline</CardTitle>
          <CardDescription>
            Championship and runner-up years for both countries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <TimelineColumn team={teamA} events={eventsA} tone="emerald" />
          <TimelineColumn team={teamB} events={eventsB} tone="sky" />
        </CardContent>
      </Card>
    </div>
  );
}

function TimelineColumn({
  team,
  events,
  tone,
}: {
  team: string;
  events: ReturnType<typeof buildTeamFinalsTimeline>;
  tone: "emerald" | "sky";
}) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-medium text-slate-200">{team}</h4>
      <div className="space-y-2">
        {events.length === 0 && (
          <p className="text-sm text-slate-500">No finals appearances.</p>
        )}
        {events.map((event) => (
          <div
            key={`${team}-${event.year}-${event.role}`}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm"
          >
            <span className="text-slate-300">{event.year}</span>
            <Badge
              className={
                tone === "emerald"
                  ? event.role === "winner"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-slate-500/30 bg-slate-500/10 text-slate-300"
                  : event.role === "winner"
                    ? "border-sky-400/30 bg-sky-400/10 text-sky-300"
                    : "border-slate-500/30 bg-slate-500/10 text-slate-300"
              }
            >
              {event.role === "winner" ? "Champion" : "Runner-up"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
