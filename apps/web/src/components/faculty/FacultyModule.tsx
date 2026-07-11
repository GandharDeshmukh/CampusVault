import { useState } from "react";

import FacultySearch from "./FacultySearch";
import AddFacultyModal from "./AddFacultyModal";
import FacultyTable from "./FacultyTable";

interface Props {
  department?: string;
}

export default function FacultyModule({
  department,
}: Props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState("");

  function refreshFaculty() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FacultySearch
          value={search}
          onChange={setSearch}
        />

        <AddFacultyModal
          department={department}
          onUploadSuccess={refreshFaculty}
        />
      </div>

      <FacultyTable
        refreshKey={refreshKey}
        search={search}
        department={department}
      />
    </div>
  );
}