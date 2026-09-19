import { useParams } from "react-router-dom";

import AchievementsModule from "@/components/achievements/AchievementsModule";

import {
  getDepartmentName,
  getDepartmentShortName,
} from "@/utils/departments";

export default function DepartmentAchievements() {
  const { department } = useParams();

  const departmentName =
    getDepartmentName(department);

  const departmentShortName =
    departmentName
      ? getDepartmentShortName(departmentName)
      : undefined;

  return (
    <AchievementsModule
      department={departmentShortName}
    />
  );
}