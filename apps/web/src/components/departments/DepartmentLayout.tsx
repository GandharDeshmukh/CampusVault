import { NavLink, Outlet, useParams } from "react-router-dom";

export default function DepartmentLayout() {
  const { department } = useParams();

  const departmentNames: Record<string, string> = {
    ce: "Computer Engineering",
    it: "Information Technology",
    entc: "Electronics & Telecommunication Engineering",
    aids: "Artificial Intelligence & Data Science",
    ece: "Electronics & Computer Engineering",
  };

  const tabs = [
    { name: "Overview", path: "overview" },
    { name: "Documents", path: "documents" },
    { name: "Achievements", path: "achievements" },
    { name: "Faculty", path: "faculty" },
    { name: "Analytics", path: "analytics" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          {departmentNames[department ?? ""] ?? "Department"}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Department Workspace
        </p>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-3 font-medium border-b-2 transition ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}