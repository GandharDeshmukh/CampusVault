import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  Trophy,
  Building2,
  BarChart3,
  FileText,
  Bell,
  Users,
  Settings,
  type LucideIcon,
  GraduationCap,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Documents",
    path: "/documents",
    icon: FolderOpen,
  },
  {
    title: "Upload Document",
    path: "/upload",
    icon: Upload,
  },
  {
    title: "Achievements",
    path: "/achievements",
    icon: Trophy,
  },
  {
  title: "Faculty",
  path: "/faculty",
  icon: GraduationCap,
},
  {
    title: "Departments",
    path: "/departments",
    icon: Building2,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    title: "Users",
    path: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];