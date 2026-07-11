import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

import { Button } from "@workspace/ui/components/button";

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
      <DialogTrigger asChild>
        <Button>
          + Add Achievement
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
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