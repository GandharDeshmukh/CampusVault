import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

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

import { navigationItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
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
      <aside className="w-72 bg-slate-900 text-white flex flex-col">
        <div className="border-b border-slate-800 p-6">
          <h1 className="text-2xl font-bold">
            CampusVault
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Digital Accreditation Portal
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                    isActive
                      ? "bg-white text-slate-900 font-semibold"
                      : "hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-red-600"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Logout
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to logout from CampusVault?
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