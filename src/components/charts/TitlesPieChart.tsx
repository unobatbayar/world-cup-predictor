"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelSettings } from "@/context/ModelSettingsContext";

const COLORS = [
  "#34d399",
  "#38bdf8",
  "#fbbf24",
  "#f472b6",
  "#a78bfa",
  "#fb7185",
  "#2dd4bf",
  "#60a5fa",
];

export function TitlesPieChart() {
  const { titleShares } = useModelSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share of World Cup titles</CardTitle>
        <CardDescription>
          Distribution of championships across winning nations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={titleShares}
                dataKey="titles"
                nameKey="team"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(props) => {
                  const team = String(props.name ?? "");
                  const titles = Number(props.value ?? 0);
                  return `${team} (${titles})`;
                }}
              >
                {titleShares.map((entry, index) => (
                  <Cell
                    key={entry.team}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
