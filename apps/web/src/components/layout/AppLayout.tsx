import { useState, type ComponentType, type Dispatch, type SetStateAction } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const SidebarComponent = Sidebar as ComponentType<{
    collapsed: boolean;
    setCollapsed: Dispatch<SetStateAction<boolean>>;
  }>;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <SidebarComponent
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}