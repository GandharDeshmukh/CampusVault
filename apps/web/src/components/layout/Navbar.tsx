import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-lg border py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <button className="rounded-lg p-2 hover:bg-slate-100">
          <Bell size={20} />
        </button>

        <button className="rounded-lg p-2 hover:bg-slate-100">
          <UserCircle2 size={30} />
        </button>
      </div>
    </header>
  );
}