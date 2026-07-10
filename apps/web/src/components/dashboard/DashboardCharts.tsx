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

const data = [
  { month: "Jan", achievements: 12 },
  { month: "Feb", achievements: 18 },
  { month: "Mar", achievements: 22 },
  { month: "Apr", achievements: 17 },
  { month: "May", achievements: 30 },
  { month: "Jun", achievements: 25 },
];

export default function DashboardCharts() {
  return (
    <Card className="rounded-2xl p-6 shadow-md">
      <h2 className="mb-6 text-xl font-semibold">
        Monthly Achievements
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
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