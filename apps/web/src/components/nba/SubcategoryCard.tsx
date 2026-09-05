import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";

import { Card } from "@workspace/ui/components/card";

import DocumentsModule from "@/components/documents/module/DocumentsModule";

import { getDocuments } from "@/services/document.service";

interface Props {
  title: string;
  department?: string;
  criterion: number;
  subcategory: string;
  onUploadSuccess?: () => void;
}

export default function SubcategoryCard({
  title,
  department,
  criterion,
  subcategory,
  onUploadSuccess,
}: Props) {
  const [open, setOpen] = useState(false);
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    loadDocumentCount();
  }, [department, criterion, subcategory]);

  async function loadDocumentCount() {
    const { data, error } = await getDocuments(
      department,
      criterion,
      subcategory
    );

    if (error) {
      console.error(error);
      return;
    }

    setDocumentCount(data?.length ?? 0);
  }

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  async function handleUploadSuccess() {
    await loadDocumentCount();
    onUploadSuccess?.();
  }

  return (
    <Card className="overflow-hidden rounded-xl border">
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between p-5 text-left transition hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-100 p-3">
            <FileText size={18} />
          </div>

          <div>
            <h3 className="font-medium">{title}</h3>

            <p className="text-sm text-muted-foreground">
              {documentCount}{" "}
              {documentCount === 1
                ? "Document"
                : "Documents"}
            </p>
          </div>
        </div>

        {open ? (
          <ChevronDown size={20} />
        ) : (
          <ChevronRight size={20} />
        )}
      </button>

      {open && (
        <div className="border-t p-5">
          <DocumentsModule
            department={department}
            criterion={criterion}
            subcategory={subcategory}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      )}
    </Card>
  );
}