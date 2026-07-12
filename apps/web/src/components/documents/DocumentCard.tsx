import { FileText } from "lucide-react";
import { getDepartmentShortName } from "@/utils/departments";
import StatusBadge from "@/components/common/StatusBadge";
import DocumentActions from "./DocumentActions";

import type { Document } from "@/types/document";

interface Props {
  document: Document;
}

export default function DocumentCard({
  document,
}: Props) {
  return (
    <div className="rounded-xl border bg-background p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="rounded-lg bg-red-100 p-3">
            <FileText className="h-6 w-6 text-red-600" />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              {document.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {document.file_name}
            </p>

            <div className="mt-3 flex gap-2">
              <StatusBadge value={document.category} />
              <StatusBadge
  value={getDepartmentShortName(document.department)}
/>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Uploaded on{" "}
              {new Date(
                document.created_at
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <DocumentActions
  document={document}
  onDeleted={() => window.location.reload()}
/>
      </div>
    </div>
  );
}