import {
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";

import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h2 className="text-xl font-semibold">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-lg border bg-background py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <ThemeToggle />

        <button className="rounded-lg p-2 transition hover:bg-accent">
          <Bell size={20} />
        </button>

        <button className="rounded-lg p-2 transition hover:bg-accent">
          <UserCircle2 size={30} />
        </button>
      </div>
    </header>
  );
}