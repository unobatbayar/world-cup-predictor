"use client";

import { useMemo } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useModelSettings } from "@/context/ModelSettingsContext";
import { buildTeamFinalsTimeline } from "@/lib/timeline";
import { formatScore } from "@/lib/utils";

type TeamDetailModalProps = {
  team: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TeamDetailModal({
  team,
  open,
  onOpenChange,
}: TeamDetailModalProps) {
  const { ratings, snapshots } = useModelSettings();

  const rating = useMemo(
    () => ratings.find((item) => item.team === team),
    [ratings, team]
  );

  const timeline = useMemo(
    () => (team ? buildTeamFinalsTimeline(team) : []),
    [team]
  );

  const progression = useMemo(() => {
    if (!team) return [];
    return snapshots.map((snapshot) => ({
      year: snapshot.year,
      score: Number((snapshot.ratings[team] ?? 0).toFixed(2)),
    }));
  }, [snapshots, team]);

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {team}
            <Badge>{formatScore(rating?.score ?? 0)} pts</Badge>
          </DialogTitle>
          <DialogDescription>
            Historical World Cup footprint and rating progression for {team}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Titles" value={rating?.titles ?? 0} />
          <Stat label="Runner-ups" value={rating?.runnerUps ?? 0} />
          <Stat label="Finals" value={rating?.finals ?? 0} />
          <Stat label="Elo-scaled" value={Math.round(rating?.scaledRating ?? 1500)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-medium text-slate-300">Years won</h4>
            <p className="text-sm text-slate-400">
              {rating?.yearsWon.length
                ? rating.yearsWon.join(", ")
                : "No titles yet"}
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-slate-300">
              Years runner-up
            </h4>
            <p className="text-sm text-slate-400">
              {rating?.yearsRunnerUp.length
                ? rating.yearsRunnerUp.join(", ")
                : "No runner-up finishes"}
            </p>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-slate-300">
            Rating progression
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progression}>
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
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-slate-300">
            Historical timeline
          </h4>
          <div className="space-y-2">
            {timeline.length === 0 && (
              <p className="text-sm text-slate-400">No finals appearances.</p>
            )}
            {timeline.map((event) => (
              <div
                key={`${event.year}-${event.role}`}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium text-slate-100">{event.year}</span>
                  <span className="ml-2 text-slate-400">Host: {event.host}</span>
                </div>
                <Badge
                  className={
                    event.role === "winner"
                      ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                      : "border-sky-400/30 bg-sky-400/10 text-sky-300"
                  }
                >
                  {event.role === "winner" ? "Champion" : "Runner-up"}
                  {event.opponent ? ` vs ${event.opponent}` : ""}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-50">{value}</p>
    </div>
  );
}
