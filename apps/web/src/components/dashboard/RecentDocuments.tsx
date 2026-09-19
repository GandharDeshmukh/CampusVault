import { useEffect, useState } from "react";
import { FileText, ArrowUpRight } from "lucide-react";

import { Card } from "@workspace/ui/components/card";

import { getRecentDocuments } from "@/services/recent.service";

interface Document {
  id: string;
  title: string;
  department: string;
  created_at: string;
}

export default function RecentDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    const { data, error } = await getRecentDocuments();

    if (error) {
      console.error(error);
      return;
    }

    setDocuments(data ?? []);
  }

  return (
    <Card className="rounded-2xl border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Recent Documents
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Recently added institutional documents
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="divide-y">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Information */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {doc.title}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{doc.department}</span>

                  <span>•</span>

                  <span>
                    {new Date(
                      doc.created_at
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Action */}
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}