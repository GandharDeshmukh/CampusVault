import { useState } from "react";
import { Download, Eye, Trash2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

import DocumentPreviewDialog from "./DocumentPreviewDialog";
import DeleteDocumentDialog from "./DeleteDocumentDialog";

import { deleteDocument } from "@/services/document.service";
import type { Document } from "@/types/document";

interface Props {
  document: Document;
  onDeleted: () => void;
}

export default function DocumentActions({
  document,
  onDeleted,
}: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete() {
    try {
      await deleteDocument(document);

      setDeleteOpen(false);

      onDeleted();
    } catch (error) {
      console.error(error);
      alert("Failed to delete document.");
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <a
            href={document.file_url}
            target="_blank"
            rel="noreferrer"
            download
          >
            <Download className="h-4 w-4" />
          </a>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      <DocumentPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={document.title}
        fileUrl={document.file_url}
      />

      <DeleteDocumentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        document={document}
        onDelete={handleDelete}
      />
    </>
  );
}