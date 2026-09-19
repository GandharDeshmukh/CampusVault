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
    <Card className="rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            {change}
          </p>
        </div>

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${color}15`,
            color,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}