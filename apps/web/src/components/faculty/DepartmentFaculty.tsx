import { useParams } from "react-router-dom";

import FacultyModule from "./FacultyModule";

const departmentMap: Record<string, string> = {
  ce: "ce",
  it: "it",
  ece: "e&ce",
  entc: "entc",
  aids: "ai&ds",
};

export default function DepartmentFaculty() {
  const { department } = useParams();

  return (
    <FacultyModule
      department={
        department
          ? departmentMap[department.toLowerCase()]
          : undefined
      }
    />
  );
}