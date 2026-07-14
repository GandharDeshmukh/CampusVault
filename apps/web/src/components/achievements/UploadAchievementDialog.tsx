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

  const [studentName, setStudentName] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [event, setEvent] =
    useState("");

  const [position, setPosition] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [achievementDate, setAchievementDate] =
    useState("");

  const [facultyGuide, setFacultyGuide] =
    useState("");

  const [externalLink, setExternalLink] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [images, setImages] =
    useState<File[]>([]);

  async function handleUpload() {
    if (
      !studentName ||
      !title ||
      !event ||
      !position ||
      !achievementDate ||
      !description ||
      !file
    ) {
      toast.warning(
        "Please fill all required fields."
      );
      return;
    }

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    try {
      await uploadAchievement(
  file,
  images,
  {
    student_name: studentName,
    title,
    description: description || null,
    department: department ?? "",
    event,
    position,
    uploaded_by: user.id,
    achievement_date: achievementDate || null,
    faculty_guide: facultyGuide || null,
    external_link: externalLink || null,
  }
);

      toast.success(
        "Achievement uploaded successfully!"
      );

      setStudentName("");
      setTitle("");
      setEvent("");
      setPosition("");
      setDescription("");
      setAchievementDate("");
      setFacultyGuide("");
      setExternalLink("");
      setFile(null);
      setImages([]);

      onUploadSuccess();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to upload achievement."
      );
    }
  }
    return (
    <div className="space-y-5">

      {/* ===========================
          Basic Information
      ============================ */}

      <div className="space-y-4">

        <h2 className="text-base font-semibold">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <div>
            <Label>Student Name *</Label>

            <Input
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) =>
                setStudentName(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Achievement Title *</Label>

            <Input
              placeholder="Enter achievement title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Event *</Label>

            <Input
              placeholder="Smart India Hackathon"
              value={event}
              onChange={(e) =>
                setEvent(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Position *</Label>

            <Input
              placeholder="Winner / Runner Up"
              value={position}
              onChange={(e) =>
                setPosition(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Achievement Date *</Label>

            <Input
              type="date"
              value={achievementDate}
              onChange={(e) =>
                setAchievementDate(
                  e.target.value
                )
              }
            />
          </div>

          <div>

            <Label>Department</Label>

            <Input
              value={department ?? ""}
              disabled
            />

          </div>

        </div>

      </div>

      {/* ===========================
          Description
      ============================ */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold">
          Description
        </h2>

        <div>

          <Label>
            Achievement Description *
          </Label>

          <textarea
            rows={3}
            placeholder="Describe the achievement..."
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />

        </div>

      </div>

      {/* ===========================
          Faculty
      ============================ */}

      <div className="space-y-2">

        <h2 className="text-lg font-semibold">
          Faculty Guide
        </h2>

        <Input
          placeholder="Faculty Mentor (Optional)"
          value={facultyGuide}
          onChange={(e) =>
            setFacultyGuide(
              e.target.value
            )
          }
        />

      </div>

      {/* ===========================
          Certificate
      ============================ */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold">
          Certificate
        </h2>

        <div>

          <Label>Upload Certificate *</Label>

          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] ??
                  null
              )
            }
          />

        </div>

      </div>
            {/* ===========================
          Achievement Images
      ============================ */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold">
          Achievement Images
        </h2>

        <div>

          <Label>Upload Images</Label>

          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setImages(
                Array.from(
                  e.target.files ?? []
                )
              )
            }
          />

          {images.length > 0 && (
            <div className="mt-4 rounded-lg border bg-muted/30 p-4">

              <p className="mb-3 text-sm font-medium">
                Selected Images
              </p>

              <div className="space-y-2">

                {images.map((image) => (
                  <div
                    key={image.name}
                    className="flex items-center justify-between rounded-md border bg-background px-3 py-2"
                  >
                    <span className="truncate text-sm">
                      📷 {image.name}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {(image.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ===========================
          External Link
      ============================ */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold">
          External Reference
        </h2>

        <Input
          placeholder="News article / GitHub / Website (Optional)"
          value={externalLink}
          onChange={(e) =>
            setExternalLink(
              e.target.value
            )
          }
        />

      </div>

      {/* ===========================
          Upload Button
      ============================ */}

      <Button
        className="w-full"
        onClick={handleUpload}
      >
        Upload Achievement
      </Button>

    </div>
  );
}