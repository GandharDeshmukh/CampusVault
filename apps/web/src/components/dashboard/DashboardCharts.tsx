import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { BarChart3 } from "lucide-react";

import { Card } from "@workspace/ui/components/card";

import { getMonthlyAchievements } from "@/services/dashboardAnalytics.service";

interface ChartData {
  month: string;
  achievements: number;
}

export default function DashboardCharts() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const result = await getMonthlyAchievements();
        setData(result);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  return (
    <Card className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              Achievement Activity
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Achievement records added over the last few months
          </p>
        </div>

        <span className="rounded-md border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Monthly
        </span>
      </div>

      <div className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No achievement activity available.
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
              barCategoryGap="35%"
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                fontSize={12}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={35}
                fontSize={12}
              />

              <Tooltip
                cursor={{
                  fill: "hsl(var(--muted))",
                  opacity: 0.35,
                }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.08)",
                }}
                labelStyle={{
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              />

              <Bar
                dataKey="achievements"
                name="Achievements"
                radius={[5, 5, 0, 0]}
                fill="hsl(var(--primary))"
                maxBarSize={42}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}