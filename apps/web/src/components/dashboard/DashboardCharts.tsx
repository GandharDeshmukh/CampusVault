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

import { Card } from "@workspace/ui/components/card";

import { getMonthlyAchievements } from "@/services/dashboardAnalytics.service";

export default function DashboardCharts() {
  const [data, setData] = useState<
    { month: string; achievements: number }[]
  >([]);

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
    <Card className="rounded-2xl p-6 shadow-md">
      <h2 className="mb-6 text-xl font-semibold">
        Monthly Achievements
      </h2>

      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="achievements"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}