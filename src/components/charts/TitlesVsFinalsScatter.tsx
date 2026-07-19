"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelSettings } from "@/context/ModelSettingsContext";

export function TitlesVsFinalsScatter() {
  const { finalsAppearances } = useModelSettings();
  const data = finalsAppearances.map((item) => ({
    team: item.team,
    titles: item.titles,
    finals: item.finals,
    size: Math.max(item.finals * 40, 60),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Titles vs finals</CardTitle>
        <CardDescription>
          Scatter plot comparing championships with finals appearances.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="finals"
                name="Finals"
                stroke="#94a3b8"
                fontSize={12}
                allowDecimals={false}
              />
              <YAxis
                type="number"
                dataKey="titles"
                name="Titles"
                stroke="#94a3b8"
                fontSize={12}
                allowDecimals={false}
              />
              <ZAxis type="number" dataKey="size" range={[60, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
                formatter={(value, name) => [value, String(name)]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.team ?? ""
                }
              />
              <Scatter data={data} fill="#38bdf8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
