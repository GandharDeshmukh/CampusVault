import DepartmentGrid from "@/components/departments/DepartmentGrid";

export default function Departments() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Departments
        </h1>

        <p className="text-muted-foreground mt-2">
          Manage department-wise documents, achievements and analytics.
        </p>
      </div>

      <DepartmentGrid />
    </div>
  );
}