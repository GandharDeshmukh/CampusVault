import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

import { Button } from "@workspace/ui/components/button";

import UploadDocumentDialog from "./UploadDocumentDialog";

interface Props {
  department?: string;
  onUploadSuccess: () => void;
}

export default function UploadDocumentModal({
  department,
  onUploadSuccess,
}: Props) { 
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          + Upload Document
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Upload Document
          </DialogTitle>
        </DialogHeader>

        <UploadDocumentDialog
  department={department}
  onUploadSuccess={() => {
    onUploadSuccess();
    setOpen(false);
  }}
/>
      </DialogContent>
    </Dialog>
  );
}