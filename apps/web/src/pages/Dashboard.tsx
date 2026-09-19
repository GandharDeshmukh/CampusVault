import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentDocuments from "@/components/dashboard/RecentDocuments";
import RecentAchievements from "@/components/dashboard/RecentAchievements";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <WelcomeBanner />

      <StatsGrid />

      {/* Analytics */}
      <section>
        <DashboardCharts />
      </section>

      {/* Recent Activity */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <p className="text-sm text-muted-foreground">
            Latest documents and achievements across CampusVault.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <RecentDocuments />
          <RecentAchievements />
        </div>
      </section>
    </div>
  );
}