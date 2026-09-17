import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

import EditUserDialog from "@/components/users/EditUserDialog";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";

import { deleteUser } from "@/services/user.service";
import type { User } from "@/types/auth";

interface Props {
  user: User;
  onDeleted: () => void;
}

export default function UserActions({
  user,
  onDeleted,
}: Props) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      const { error } = await deleteUser(user.id);

      if (error) {
        throw error;
      }

      toast.success("User deleted.");

      setOpen(false);

      onDeleted();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete user.");
    }
  }

  return (
    <>
      <div className="flex justify-end gap-1">
        <EditUserDialog
          user={user}
          onSuccess={onDeleted}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          title="Delete user"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      <DeleteConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete User"
        description={`Delete ${user.name}?`}
        onConfirm={handleDelete}
      />
    </>
  );
}