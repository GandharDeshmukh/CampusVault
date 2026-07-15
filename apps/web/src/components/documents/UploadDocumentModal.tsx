import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

import UploadDocumentDialog from "./UploadDocumentDialog";

interface Props {
  department?: string;

  // NBA
  criterion?: number;
  subcategory?: string;

  onUploadSuccess: () => void;
}

export default function UploadDocumentModal({
  department,
  criterion,
  subcategory,
  onUploadSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        + Upload Document
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Upload Document
          </DialogTitle>
        </DialogHeader>

        <UploadDocumentDialog
          department={department}
          criterion={criterion}
          subcategory={subcategory}
          onUploadSuccess={() => {
            onUploadSuccess();
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}