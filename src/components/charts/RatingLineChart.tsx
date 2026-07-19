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
import { useModelSettings } from "@/context/ModelSettingsContext";

const COLORS = ["#34d399", "#38bdf8", "#fbbf24", "#f472b6", "#a78bfa"];

export function RatingLineChart() {
  const { ratings, snapshots } = useModelSettings();
  const topTeams = ratings.slice(0, 5).map((team) => team.team);

  const data = useMemo(
    () =>
      snapshots.map((snapshot) => {
        const point: Record<string, number> = { year: snapshot.year };
        for (const team of topTeams) {
          point[team] = Number((snapshot.ratings[team] ?? 0).toFixed(2));
        }
        return point;
      }),
    [snapshots, topTeams]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating over time</CardTitle>
        <CardDescription>
          Rating evolution for the current top five nations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
              {topTeams.map((team, index) => (
                <Line
                  key={team}
                  type="monotone"
                  dataKey={team}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
