import {
  LayoutDashboard,
  FolderOpen,
  Trophy,
  Building2,
  BarChart3,
  FileText,
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
  title: "NBA Accreditation",
  path: "/documents",
  icon: FolderOpen,
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