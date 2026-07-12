import { useParams } from "react-router-dom";

import DocumentsModule from "@/components/documents/module/DocumentsModule";
import { getDepartmentName } from "@/utils/departments";

export default function DepartmentDocuments() {
  const { department } = useParams();

  return (
    <DocumentsModule
      department={getDepartmentName(department)}
    />
  );
}