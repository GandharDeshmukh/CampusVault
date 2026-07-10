import { useEffect, useState } from "react";

import { getDocuments } from "@/services/document.service";
import type { Document } from "@/types/document";

import DocumentCard from "./DocumentCard";

interface Props {
  refreshKey: number;
  search: string;
  department?: string;
}

export default function DocumentsGrid({
  refreshKey,
  search,
  department,
}: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    loadDocuments();
  }, [refreshKey, department, search]);

  async function loadDocuments() {
    const { data, error } = await getDocuments(department);

    if (error) {
      console.error(error);
      return;
    }

    if (!data) {
      setDocuments([]);
      return;
    }

    const filtered = data.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );

    setDocuments(filtered);
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/20 py-16 text-center">
        <h3 className="text-lg font-semibold">
          No documents found
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Upload your first document to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
        />
      ))}
    </div>
  );
}