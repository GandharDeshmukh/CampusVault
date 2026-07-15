import { useParams } from "react-router-dom";

import CriterionAccordion from "@/components/nba/CriterionAccordion";
import { getDepartmentName } from "@/utils/departments";

export default function DepartmentDocuments() {
  const { department } = useParams();

  return (
    <CriterionAccordion
      department={getDepartmentName(department)}
    />
  );
}