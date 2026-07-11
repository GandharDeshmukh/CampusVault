import { useEffect, useState } from "react";

import { getFaculty } from "@/services/faculty.service";
import type { Faculty } from "@/types/faculty";

import FacultyActions from "./FacultyActions";

interface Props {
  refreshKey: number;
  search: string;
  department?: string;
}

export default function FacultyTable({
  refreshKey,
  search,
  department,
}: Props) {
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  useEffect(() => {
    loadFaculty();
  }, [refreshKey, department]);

  async function loadFaculty() {
    const { data, error } = await getFaculty(department);

    if (error) {
      console.error(error);
      return;
    }

    setFaculty(data ?? []);
  }

  const filteredFaculty = faculty.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredFaculty.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/20 py-16 text-center">
        <h3 className="text-lg font-semibold">
          No faculty found
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Add your first faculty member.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left">
              Faculty
            </th>

            <th className="px-4 py-3 text-left">
              Designation
            </th>

            <th className="px-4 py-3 text-left">
              Qualification
            </th>

            <th className="px-4 py-3 text-left">
              Email
            </th>

            <th className="px-4 py-3 text-left">
              Department
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredFaculty.map((member) => (
            <tr
              key={member.id}
              className="border-t hover:bg-muted/30"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      member.photo_url ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(member.name)
                    }
                    alt={member.name}
                    className="h-11 w-11 rounded-full border object-cover"
                  />

                  <div>
                    <p className="font-medium">
                      {member.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {member.research_area || "Faculty Member"}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3">
                {member.designation}
              </td>

              <td className="px-4 py-3">
                {member.qualification}
              </td>

              <td className="px-4 py-3">
                {member.email || "-"}
              </td>

              <td className="px-4 py-3">
                {member.department}
              </td>

              <td className="px-4 py-3 text-right">
                <FacultyActions
                  faculty={member}
                  onDeleted={loadFaculty}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}