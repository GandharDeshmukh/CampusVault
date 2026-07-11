import { useEffect, useState } from "react";

import { Card } from "@workspace/ui/components/card";
import { Trophy } from "lucide-react";

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
    <Card className="rounded-2xl p-6 shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Achievements
        </h2>

        <Trophy className="text-yellow-500" />
      </div>

      {achievements.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          No achievements yet.
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100 dark:bg-muted dark:hover:bg-muted/70"
            >
              <p className="font-medium">
                {achievement.title}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {achievement.student_name}
              </p>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {achievement.department}
                </span>

                <span className="text-xs text-muted-foreground">
                  {new Date(
                    achievement.created_at
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}