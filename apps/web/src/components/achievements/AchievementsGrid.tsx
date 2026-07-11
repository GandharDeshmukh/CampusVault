import { useEffect, useState } from "react";

import { getAchievements } from "@/services/achievement.service";
import type { Achievement } from "@/types/achievement";

import AchievementCard from "./AchievementCard";

interface Props {
  refreshKey: number;
  search: string;
  department?: string;
}

export default function AchievementsGrid({
  refreshKey,
  search,
  department,
}: Props) {
  const [achievements, setAchievements] = useState<
    Achievement[]
  >([]);

  useEffect(() => {
    loadAchievements();
  }, [refreshKey, department]);

  async function loadAchievements() {
    const { data, error } =
      await getAchievements(department);

    if (error) {
      console.error(error);
      return;
    }

    setAchievements(data ?? []);
  }

  const filteredAchievements =
    achievements.filter((achievement) =>
      achievement.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  if (filteredAchievements.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/20 py-16 text-center">
        <h3 className="text-lg font-semibold">
          No achievements found
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Add your first achievement to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {filteredAchievements.map(
        (achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onDeleted={loadAchievements}
          />
        )
      )}
    </div>
  );
}