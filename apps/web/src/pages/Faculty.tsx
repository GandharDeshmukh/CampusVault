import FacultyModule from "@/components/faculty/FacultyModule";

export default function Faculty() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Faculty
        </h1>

        <p className="text-muted-foreground">
          Manage faculty members of your institute.
        </p>
      </div>

      <FacultyModule />
    </div>
  );
}