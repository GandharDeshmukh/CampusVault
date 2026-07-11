import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";



import AddFacultyDialog from "./AddFacultyDialog";

interface Props {
  department?: string;
  onUploadSuccess: () => void;
}

export default function AddFacultyModal({
  department,
  onUploadSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
  + Add Faculty
</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Add Faculty
          </DialogTitle>
        </DialogHeader>

        <AddFacultyDialog
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