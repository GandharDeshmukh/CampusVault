import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DepartmentDashboard from "@/pages/departments/DepartmentDashboard";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import Achievements from "@/pages/Achievements";
import Departments from "@/pages/Departments";
import Login from "@/pages/Login";

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
    <Route
  path="/department/:department"
  element={<DepartmentDashboard />}
/>
</Route>

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}