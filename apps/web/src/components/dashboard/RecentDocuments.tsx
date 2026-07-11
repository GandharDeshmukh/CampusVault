import { useEffect, useState } from "react";

import { Card } from "@workspace/ui/components/card";
import { FileText } from "lucide-react";

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
    <Card className="rounded-2xl p-6 shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Documents
        </h2>

        <FileText className="text-blue-600" />
      </div>

      {documents.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100 dark:bg-muted dark:hover:bg-muted/70"
            >
              <div>
                <p className="font-medium">
                  {doc.title}
                </p>

                <p className="text-sm text-slate-500">
                  {doc.department}
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                {new Date(doc.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}