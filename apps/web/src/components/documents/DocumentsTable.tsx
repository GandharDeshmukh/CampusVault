import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import { getDocuments } from "@/services/document.service";
import type { Document } from "@/types/document";

import StatusBadge from "@/components/common/StatusBadge";
import DocumentActions from "@/components/documents/DocumentActions";

interface Props {
  refreshKey: number;
  search: string;
  department?: string;
}

export default function DocumentsTable({
  refreshKey,
  search,
  department,
}: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    loadDocuments();
  }, [refreshKey, department]);

  async function loadDocuments() {
    const { data } = await getDocuments(department);

    if (data) {
      const filtered = data.filter((doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase())
      );

      setDocuments(filtered);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-4 text-left">Document</th>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-left">Department</th>
            <th className="px-6 py-4 text-left">Uploaded</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-10 text-center text-muted-foreground"
              >
                No documents found.
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <tr
                key={doc.id}
                className="border-t transition-colors hover:bg-muted/40"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-red-500" />

                    <div>
                      <p className="font-medium">
                        {doc.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {doc.file_name}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <StatusBadge value={doc.category} />
                </td>

                <td className="px-6 py-4">
                  <StatusBadge value={doc.department} />
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    doc.created_at
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="px-6 py-4 text-center">
                  <DocumentActions
                    fileUrl={doc.file_url}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}