import {
  Calendar,
  ExternalLink,
  FileText,
  Trophy,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { Achievement } from "@/types/achievement";

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

  const previewImage =
    achievement.image_urls?.[0];

  return (
    <div className="overflow-hidden rounded-xl border bg-background transition hover:shadow-lg">
      <div className="flex flex-col md:flex-row">

        <div
          className="cursor-pointer md:w-72"
          onClick={() =>
            navigate(`/achievements/${achievement.id}`)
          }
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt={achievement.title}
              className="h-56 w-full object-cover"
            />
          ) : (
            <div className="flex h-56 items-center justify-center bg-muted">
              <Trophy className="h-14 w-14 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-1 justify-between p-6">

          <div
            className="flex-1 cursor-pointer"
            onClick={() =>
              navigate(`/achievements/${achievement.id}`)
            }
          >

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="text-2xl font-bold">
                {achievement.title}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeColor()}`}
              >
                {achievement.position}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {achievement.department}
              </span>

            </div>

            <div className="mt-5 space-y-3 text-sm">

              <p className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {achievement.student_name}
              </p>

              <p>
                <strong>Event:</strong>{" "}
                {achievement.event}
              </p>

              {achievement.achievement_date && (
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />

                  {new Date(
                    achievement.achievement_date
                  ).toLocaleDateString()}
                </p>
              )}

              {achievement.faculty_guide && (
                <p>
                  <strong>Faculty Guide:</strong>{" "}
                  {achievement.faculty_guide}
                </p>
              )}

              {achievement.description && (
                <p className="text-muted-foreground">
                  {achievement.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                                {achievement.certificate_url && (
                  <a
                    href={achievement.certificate_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                  >
                    <FileText className="h-4 w-4" />
                    View Certificate
                  </a>
                )}

                {achievement.external_link && (
                  <a
                    href={achievement.external_link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                    External Link
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <AchievementActions
              achievement={achievement}
              onDeleted={onDeleted}
            />
          </div>

        </div>
      </div>
    </div>
  );
}