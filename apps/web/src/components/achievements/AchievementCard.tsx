import { Trophy } from "lucide-react";

import type { Achievement } from "@/types/achievement";
import { useNavigate } from "react-router-dom";
import AchievementActions from "./AchievementActions";

interface Props {
  achievement: Achievement;
  onDeleted: () => void;
}

export default function AchievementCard({
  achievement,
  onDeleted,
}: Props) {
  const navigate = useNavigate();
  function getBadgeColor() {
    const position = achievement.position.toLowerCase();

    if (
      position.includes("winner") ||
      position.includes("1")
    ) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (
      position.includes("runner") ||
      position.includes("2")
    ) {
      return "bg-gray-100 text-gray-700";
    }

    if (position.includes("3")) {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-blue-100 text-blue-700";
  }

 return (
  <div className="rounded-xl border bg-background p-5 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div
  className="flex cursor-pointer gap-4"
  onClick={() => {
  navigate(`/achievements/${achievement.id}`);
}}
>
          <div className="rounded-full bg-yellow-100 p-3">
            <Trophy className="h-7 w-7 text-yellow-600" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {achievement.title}
            </h2>

            <p className="mt-1 text-muted-foreground">
              👤 {achievement.student_name}
            </p>

            <p className="text-muted-foreground">
              📍 {achievement.event}
            </p>

            <div className="mt-3 flex gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getBadgeColor()}`}
              >
                {achievement.position}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                {achievement.department}
              </span>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {new Date(
                achievement.created_at
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <AchievementActions
          achievement={achievement}
          onDeleted={onDeleted}
        />
      </div>
    </div>
  );
}