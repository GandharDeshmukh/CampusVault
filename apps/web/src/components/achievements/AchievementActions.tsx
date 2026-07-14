import { useState } from "react";
import { Download, Eye, Trash2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

import FilePreviewDialog from "@/components/common/FilePreviewDialog";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";

import type { Achievement } from "@/types/achievement";
import { deleteAchievement } from "@/services/achievement.service";

interface Props {
  achievement: Achievement;
  onDeleted: () => void;
}

export default function AchievementActions({
  achievement,
  onDeleted,
}: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete() {
    try {
      await deleteAchievement(achievement);

      toast.success("Achievement deleted successfully.");

      setDeleteOpen(false);

      onDeleted();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete achievement.");
    }
  }

  async function handleDownload() {
    try {
      if (!achievement.certificate_url) {
  toast.error("Certificate not available.");
  return;
}

const response = await fetch(
  achievement.certificate_url
);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
     link.download =
  achievement.certificate_name ??
  "certificate.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Download started.");
    } catch (error) {
      console.error(error);

      toast.error("Failed to download certificate.");
    }
  }

  return (
    <>
      <div
  className="flex items-center gap-1"
  onClick={(e) => e.stopPropagation()}
>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
  e.stopPropagation();
  setPreviewOpen(true);
}}
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
  e.stopPropagation();
  handleDownload();
}}
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
  e.stopPropagation();
  setDeleteOpen(true);
}}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      <FilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={achievement.title}
        fileUrl={achievement.certificate_url ?? ""}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Achievement"
        description={`Are you sure you want to delete "${achievement.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}