import { NavLink } from "react-router-dom";
import { navigationItems } from "@/config/navigation";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold">CampusVault</h1>

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
    </aside>
  );
}