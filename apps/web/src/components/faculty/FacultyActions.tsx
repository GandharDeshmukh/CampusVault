import { Trash2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";

import { useState } from "react";

import type { Faculty } from "@/types/faculty";
import { deleteFaculty } from "@/services/faculty.service";

interface Props {
  faculty: Faculty;
  onDeleted: () => void;
}

export default function FacultyActions({
  faculty,
  onDeleted,
}: Props) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      await deleteFaculty(faculty);

      toast.success("Faculty deleted.");

      setOpen(false);

      onDeleted();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete faculty.");
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>

      <DeleteConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Faculty"
        description={`Delete ${faculty.name}?`}
        onConfirm={handleDelete}
      />
    </>
  );
}