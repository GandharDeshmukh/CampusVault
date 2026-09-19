import { useEffect, useState } from "react";
import { Trophy, ArrowUpRight } from "lucide-react";

import { Card } from "@workspace/ui/components/card";

import { getRecentAchievements } from "@/services/recent.service";

interface Achievement {
  id: string;
  title: string;
  student_name: string;
  department: string;
  created_at: string;
}

export default function RecentAchievements() {
  const [achievements, setAchievements] = useState<
    Achievement[]
  >([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  async function loadAchievements() {
    const { data, error } =
      await getRecentAchievements();

    if (error) {
      console.error(error);
      return;
    }

    setAchievements(data ?? []);
  }

  return (
    <Card className="rounded-2xl border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Recent Achievements
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Recently recorded student achievements
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
          <Trophy className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {achievements.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
          No achievements yet.
        </div>
      ) : (
        <div className="divide-y">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Information */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {achievement.title}
                </p>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {achievement.student_name}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{achievement.department}</span>

                  <span>•</span>

                  <span>
                    {new Date(
                      achievement.created_at
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Action */}
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}