import { useParams } from "react-router-dom";

import AchievementsModule from "@/components/achievements/AchievementsModule";

export default function DepartmentAchievements() {
  const { department } = useParams();

  return (
    <AchievementsModule
      department={department}
    />
  );
}