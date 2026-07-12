import { useParams } from "react-router-dom";

import AchievementsModule from "@/components/achievements/AchievementsModule";
import { getDepartmentName, getDepartmentShortName } from "../../../utils/departments";

export default function DepartmentAchievements() {
  const { department } = useParams();

  return (
    <AchievementsModule
      department={getDepartmentShortName(getDepartmentName(department) ?? "").toLowerCase()}
    />
  );
}