import { useState } from "react";

import UploadAchievementModal from "./UploadAchievementModal";
import AchievementSearch from "./AchievementSearch";
import AchievementsGrid from "./AchievementsGrid";

interface Props {
  department?: string;
}

export default function AchievementsModule({
  department,
}: Props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState("");

  function refreshAchievements() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AchievementSearch
          value={search}
          onChange={setSearch}
        />

        <UploadAchievementModal
          department={department}
          onUploadSuccess={refreshAchievements}
        />
      </div>

      <AchievementsGrid
        refreshKey={refreshKey}
        search={search}
        department={department}
      />
    </div>
  );
}