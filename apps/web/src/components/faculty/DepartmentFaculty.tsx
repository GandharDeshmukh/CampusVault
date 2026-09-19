import { useParams } from "react-router-dom";

import FacultyModule from "./FacultyModule";

const departmentMap: Record<string, string> = {
  ce: "ce",
  entc: "entc",
  it: "it",
  aids: "ai&ds",
  ece: "e&ce",
};

export default function DepartmentFaculty() {
  const { department } = useParams();

  const departmentKey =
    department?.toLowerCase();

  const departmentValue =
    departmentKey
      ? departmentMap[departmentKey]
      : undefined;

  return (
    <FacultyModule
      department={departmentValue}
    />
  );
}