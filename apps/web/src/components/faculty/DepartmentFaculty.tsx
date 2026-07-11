import { useParams } from "react-router-dom";

import FacultyModule from "./FacultyModule";

export default function DepartmentFaculty() {
  const { department } = useParams();

  return (
    <FacultyModule
      department={department}
    />
  );
}