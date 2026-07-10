import { useParams } from "react-router-dom";

import DocumentsModule from "@/components/documents/module/DocumentsModule";

export default function DepartmentDocuments() {
  const { department } = useParams();

  return (
    <DocumentsModule
      department={department?.toUpperCase()}
    />
  );
}