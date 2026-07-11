import AchievementsModule from "@/components/achievements/AchievementsModule";

export default function Achievements() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Achievements
        </h1>

        <p className="text-muted-foreground">
          Manage student achievements and certificates.
        </p>
      </div>

      <AchievementsModule />
    </div>
  );
}