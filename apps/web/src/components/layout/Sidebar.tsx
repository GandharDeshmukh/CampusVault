import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

import logo from "@/assets/logo.png";
import { navigationItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <aside
        className={`${
          collapsed ? "w-16" : "w-72"
        } bg-slate-900 text-white flex flex-col transition-all duration-300`}
      >
        {/* Header */}

        <div className="border-b border-slate-800 p-5">

          <div
            className={`flex flex-col ${
              collapsed
                ? "items-center"
                : ""
            }`}
          >

            <div
              className={`flex items-center ${
                collapsed
                  ? ""
                  : "gap-3"
              }`}
            >

              <img
                src={logo}
                alt="CampusVault"
                className="h-12 w-12 rounded-xl bg-white p-1 object-contain"
              />

              {!collapsed && (
                <div>
                  <h1 className="text-2xl font-bold tracking-wide">
                    CampusVault
                  </h1>

                  <p className="text-sm text-slate-400">
                    Digital Accreditation Portal
                  </p>
                </div>
              )}

            </div>

            <button
              onClick={() =>
                setCollapsed(!collapsed)
              }
              className={`mt-4 flex items-center rounded-lg px-3 py-2 transition-all hover:bg-slate-800 ${
                collapsed
                  ? "justify-center"
                  : "gap-2 self-start"
              }`}
            >
              {collapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <>
                  <PanelLeftClose size={18} />
                  <span className="text-sm">
                    Collapse
                  </span>
                </>
              )}
            </button>

          </div>

        </div>

        <nav className="flex-1 space-y-2 p-4">
                    {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                title={collapsed ? item.title : ""}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-4 py-3 transition-all duration-200 ${
                    collapsed
                      ? "justify-center"
                      : "gap-3"
                  } ${
                    isActive
                      ? "bg-white text-slate-900 font-semibold"
                      : "hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon
                  size={20}
                  className="shrink-0"
                />

                {!collapsed && (
                  <span className="truncate">
                    {item.title}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            onClick={() => setOpen(true)}
            title={collapsed ? "Logout" : ""}
            className={`flex w-full items-center rounded-lg px-4 py-3 transition-all duration-200 hover:bg-red-600 ${
              collapsed
                ? "justify-center"
                : "gap-3"
            }`}
          >
            <LogOut
              size={20}
              className="shrink-0"
            />

            {!collapsed && (
              <span>Logout</span>
            )}
          </button>
        </div>
      </aside>
            <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Logout
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to logout
              from CampusVault?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              No
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}