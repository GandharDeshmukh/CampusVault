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
    <Card className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl">

      {/* Background Glow */}
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-3xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex items-start justify-between">

        <div className="space-y-3">

          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>

          <h2 className="text-4xl font-bold tracking-tight">
            {value}
          </h2>

          <div className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            {change}
          </div>

        </div>

        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}CC)`,
          }}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>

      </div>
    </Card>
  );
}