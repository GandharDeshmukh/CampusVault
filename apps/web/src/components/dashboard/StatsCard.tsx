import { Card } from "@workspace/ui/components/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  change: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  change,
}: StatsCardProps) {
  return (
    <Card className="rounded-2xl border-0 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-4xl font-bold text-slate-800">
            {value}
          </h2>

          <p className="mt-3 text-sm font-medium text-green-600">
            {change}
          </p>
        </div>

        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: color }}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </Card>
  );
}