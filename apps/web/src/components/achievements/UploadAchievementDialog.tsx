import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";


import { toast } from "sonner";

import { uploadAchievement } from "@/services/achievement.service";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  department?: string;
  onUploadSuccess: () => void;
}

export default function UploadAchievementDialog({
  department,
  onUploadSuccess,
}: Props) {
  const { user } = useAuth();

  const [studentName, setStudentName] = useState("");
  const [title, setTitle] = useState("");
  const [event, setEvent] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (
      !studentName ||
      !title ||
      !event ||
      !position ||
      !file
    ) {
      toast.warning("Please fill all required fields.");
      return;
    }

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    try {
      await uploadAchievement(file, {
        student_name: studentName,
        title,
        description,
        department: department ?? "",
        event,
        position,
        uploaded_by: user.id,
        certificate_name: "",
      });

      toast.success("Achievement uploaded successfully!");

      setStudentName("");
      setTitle("");
      setEvent("");
      setPosition("");
      setDescription("");
      setFile(null);

      onUploadSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload achievement.");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Student Name</Label>
        <Input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </div>

      <div>
        <Label>Achievement Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <Label>Event</Label>
        <Input
          value={event}
          onChange={(e) => setEvent(e.target.value)}
        />
      </div>

      <div>
        <Label>Position</Label>
        <Input
          placeholder="Winner / Runner Up / Participation"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>

      <div>
        <Label>Description</Label>
        <textarea
  rows={4}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
/>
      </div>

      <div>
        <Label>Certificate</Label>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) =>
            setFile(e.target.files?.[0] ?? null)
          }
        />
      </div>

      <Button
        className="w-full"
        onClick={handleUpload}
      >
        Upload Achievement
      </Button>
    </div>
  );
}