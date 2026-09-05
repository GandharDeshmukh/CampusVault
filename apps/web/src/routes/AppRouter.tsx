import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DepartmentDashboard from "@/pages/departments/DepartmentDashboard";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import Achievements from "@/pages/Achievements";
import Departments from "@/pages/Departments";
import Login from "@/pages/Login";
import DepartmentOverview from "@/components/departments/overview/DepartmentOverview";
import DepartmentDocuments from "@/components/departments/documents/DepartmentDocuments";
import DepartmentAchievements from "@/components/departments/achievements/DepartmentAchievements";
import DepartmentFaculty from "@/components/faculty/DepartmentFaculty";
import DepartmentAnalytics from "@/components/departments/analytics/DepartmentAnalytics";
import Faculty from "@/pages/Faculty";
import AchievementDetails from "@/pages/AchievementDetails";
import CriterionDetails from "@/pages/CriterionDetails";
import NbaCriteriaModule from "@/components/nba/NbaCriteriaModule";
import Reports from "@/pages/Reports";
import AcademicCalendar from "@/pages/AcademicCalendar";
import ActivityPlanner from "@/pages/ActivityPlanner";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
    element={
        <ProtectedRoute>
            <AppLayout />
        </ProtectedRoute>
    }
>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/documents" element={<Documents />} />
    <Route path="/achievements" element={<Achievements />} />
    <Route path="/departments" element={<Departments />} />
    <Route path="/nba" element={<NbaCriteriaModule />} />
    <Route
  path="/activity-planner"
  element={<ActivityPlanner />}
/>
    <Route
  path="/academic-calendar"
  element={<AcademicCalendar />}
/>
    <Route
  path="/reports/:department"
  element={<Reports />}
/>
    <Route
  path="/reports"
  element={<Reports />}
/>
    <Route
  path="/nba/:department"
  element={<NbaCriteriaModule />}
/>

<Route
  path="/nba/:department/criterion/:criterionId"
  element={<CriterionDetails />}
/>
    <Route
  path="/nba/:department"
  element={<NbaCriteriaModule />}
/>

<Route
  path="/nba/:department/criterion/:criterionId"
  element={<CriterionDetails />}
/>
    <Route
  path="/nba/criterion/:criterionId"
  element={<CriterionDetails />}
/>
    <Route
  path="/faculty"
  element={<Faculty />}
/>
<Route
  path="/achievements/:id"
  element={<AchievementDetails />}
/>
    <Route
  path="/department/:department"
  element={<DepartmentDashboard />}
>
  <Route
    index
    element={<Navigate to="overview" replace />}
  />

  <Route
    path="overview"
    element={<DepartmentOverview />}
  />

  <Route
    path="documents"
    element={<DepartmentDocuments />}
  />
  <Route
  path="documents/criterion/:criterionId"
  element={<CriterionDetails />}
/>
  <Route
    path="achievements"
    element={<DepartmentAchievements />}
  />

  <Route
    path="faculty"
    element={<DepartmentFaculty />}
  />

  <Route
    path="analytics"
    element={<DepartmentAnalytics />}
  />
</Route>
</Route>

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}