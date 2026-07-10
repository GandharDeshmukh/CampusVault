import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fileUrl: string;
}

export default function DocumentPreviewDialog({
  open,
  onOpenChange,
  title,
  fileUrl,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-6xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <iframe
          src={fileUrl}
          title={title}
          className="h-[75vh] w-full rounded-lg border"
        />
      </DialogContent>
    </Dialog>
  );
}