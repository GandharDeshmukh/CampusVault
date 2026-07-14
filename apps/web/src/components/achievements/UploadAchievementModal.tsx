import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";



import UploadAchievementDialog from "./UploadAchievementDialog";

interface Props {
  department?: string;
  onUploadSuccess: () => void;
}

export default function UploadAchievementModal({
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
  + Add Achievement
</DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Add Achievement
          </DialogTitle>
        </DialogHeader>

        <UploadAchievementDialog
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