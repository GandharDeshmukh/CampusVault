import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Trophy,
  User,
  Building2,
  Calendar,
  MapPin,
} from "lucide-react";

import { getAchievementById } from "@/services/achievement.service";
import type { Achievement } from "@/types/achievement";

// Change this import if your Button component comes from a different package.
import { Button } from "@workspace/ui/components/button";

export default function AchievementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [achievement, setAchievement] =
    useState<Achievement | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievement() {
      if (!id) return;

      try {
        const data = await getAchievementById(id);
        setAchievement(data);
      } finally {
        setLoading(false);
      }
    }

    loadAchievement();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!achievement) {
    return (
      <div className="p-6">
        Achievement not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Back Button */}

      <Button
        variant="outline"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Header */}

      <div className="rounded-xl border bg-background p-6">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-5">

            <div className="rounded-full bg-yellow-100 p-4">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>

            <div>

              <h1 className="text-3xl font-bold">
                {achievement.title}
              </h1>

              <p className="mt-1 text-muted-foreground">
                {achievement.student_name}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                  {achievement.position}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  {achievement.department}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Information Card */}

      <div className="rounded-xl border bg-background p-6">

        <h2 className="mb-6 text-xl font-semibold">
          Achievement Information
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="flex items-center gap-3">

            <User className="h-5 w-5 text-primary" />

            <div>

              <p className="text-sm text-muted-foreground">
                Student
              </p>

              <p className="font-medium">
                {achievement.student_name}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Building2 className="h-5 w-5 text-primary" />

            <div>

              <p className="text-sm text-muted-foreground">
                Department
              </p>

              <p className="font-medium">
                {achievement.department}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <MapPin className="h-5 w-5 text-primary" />

            <div>

              <p className="text-sm text-muted-foreground">
                Event
              </p>

              <p className="font-medium">
                {achievement.event}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Calendar className="h-5 w-5 text-primary" />

            <div>

              <p className="text-sm text-muted-foreground">
                Date
              </p>

              <p className="font-medium">
                {new Date(
                  achievement.created_at
                ).toLocaleDateString()}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}