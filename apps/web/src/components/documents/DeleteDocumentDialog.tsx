import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

import type { Document } from "@/types/document";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
  onDelete: () => Promise<void>;
}

export default function DeleteDocumentDialog({
  open,
  onOpenChange,
  document,
  onDelete,
}: Props) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Document?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete
            <strong> {document.title}</strong>?
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}