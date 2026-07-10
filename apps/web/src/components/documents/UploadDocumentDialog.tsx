import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "sonner";
import { uploadDocument } from "@/services/document.service";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  department?: string;
  onUploadSuccess: () => void;
}

export default function UploadDocumentDialog({
  department,
  onUploadSuccess,
}: Props) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!title || !category || !file) {
     toast.warning("Please fill all required fields.");
      return;
    }

    if (!user) {
     toast.error("Please login first.");
      return;
    }

    try {
      await uploadDocument(file, {
        title,
        description: "",
        category,
       department: department ?? "", // Temporary. We'll make this dynamic later.
        uploaded_by: user.id,
        file_name: "",
      });

     toast.success("Document uploaded successfully!");

      setTitle("");
      setCategory("");
      setFile(null);

      onUploadSuccess();
    } catch (error) {
      console.error(error);
     toast.error("Failed to upload document.");
    }
  }

  return (
    <div className="space-y-4 rounded-xl border p-6">
      <h2 className="text-xl font-bold">
        Upload Document
      </h2>

      <div>
        <Label>Title</Label>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <Label>Category</Label>

        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div>
        <Label>Choose File</Label>

        <Input
          type="file"
          onChange={(e) =>
            setFile(e.target.files?.[0] ?? null)
          }
        />
      </div>

      <Button
        onClick={handleUpload}
        className="w-full"
      >
        Upload Document
      </Button>
    </div>
  );
}