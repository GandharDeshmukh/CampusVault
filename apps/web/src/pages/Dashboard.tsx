import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentDocuments from "@/components/dashboard/RecentDocuments";
import RecentAchievements from "@/components/dashboard/RecentAchievements";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <WelcomeBanner />

      <StatsGrid />

      <DashboardCharts />

      <div className="grid gap-8 xl:grid-cols-2">
        <RecentDocuments />

        <RecentAchievements />
      </div>
    </div>
  );
}