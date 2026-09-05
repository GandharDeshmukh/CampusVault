import { useEffect, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { uploadAchievement } from "@/services/achievement.service";
import { departments } from "@/utils/departments";

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

  const [selectedDepartment, setSelectedDepartment] =
    useState(department ?? "");

  const [file, setFile] =
    useState<File | null>(null);

  const [images, setImages] =
    useState<File[]>([]);

  useEffect(() => {
    setSelectedDepartment(department ?? "");
  }, [department]);

  async function handleUpload() {
    const finalDepartment =
      department ?? selectedDepartment;

    if (!studentName.trim()) {
      toast.warning(
        "Please enter the student name."
      );
      return;
    }

    if (!title.trim()) {
      toast.warning(
        "Please enter the achievement title."
      );
      return;
    }

    if (!event.trim()) {
      toast.warning(
        "Please enter the event."
      );
      return;
    }

    if (!position.trim()) {
      toast.warning(
        "Please enter the position."
      );
      return;
    }

    if (!achievementDate) {
      toast.warning(
        "Please select the achievement date."
      );
      return;
    }

    if (!finalDepartment) {
      toast.warning(
        "Please select a department."
      );
      return;
    }

    if (!file) {
      toast.warning(
        "Please upload the certificate."
      );
      return;
    }

    if (!user) {
      toast.error(
        "Please login first."
      );
      return;
    }

    try {
      await uploadAchievement(
        file,
        images,
        {
          student_name:
            studentName.trim(),

          title:
            title.trim(),

          description:
            description.trim() || null,

          department:
            finalDepartment,

          event:
            event.trim(),

          position:
            position.trim(),

          uploaded_by:
            user.id,

          achievement_date:
            achievementDate,

          faculty_guide:
            facultyGuide.trim() || null,

          external_link:
            externalLink.trim() || null,
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

      if (!department) {
        setSelectedDepartment("");
      }

      onUploadSuccess();

    } catch (error) {
      console.error(
        "Achievement upload failed:",
        error
      );

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

          {/* Student Name */}

          <div className="space-y-2">
            <Label>
              Student Name *
            </Label>

            <Input
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) =>
                setStudentName(
                  e.target.value
                )
              }
            />
          </div>

          {/* Achievement Title */}

          <div className="space-y-2">
            <Label>
              Achievement Title *
            </Label>

            <Input
              placeholder="Enter achievement title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />
          </div>

          {/* Event */}

          <div className="space-y-2">
            <Label>
              Event *
            </Label>

            <Input
              placeholder="Smart India Hackathon"
              value={event}
              onChange={(e) =>
                setEvent(
                  e.target.value
                )
              }
            />
          </div>

          {/* Position */}

          <div className="space-y-2">
            <Label>
              Position *
            </Label>

            <Input
              placeholder="Winner / Runner Up"
              value={position}
              onChange={(e) =>
                setPosition(
                  e.target.value
                )
              }
            />
          </div>

          {/* Achievement Date */}

          <div className="space-y-2">
            <Label>
              Achievement Date *
            </Label>

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

          {/* Department */}

          <div className="space-y-2">
            <Label>
              Department *
            </Label>

            {department ? (
              <Input
                value={
                  departments[
                    department as keyof typeof departments
                  ]?.name ?? department
                }
                disabled
              />
            ) : (
              <select
                value={selectedDepartment}
                onChange={(e) =>
                  setSelectedDepartment(
                    e.target.value
                  )
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              >
                <option value="">
                  Select Department
                </option>

                {Object.values(
                  departments
                ).map((dept) => (
                  <option
                    key={dept.slug}
                    value={dept.slug}
                  >
                    {dept.shortName} —{" "}
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
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

        <div className="space-y-2">

          <Label>
            Achievement Description
          </Label>

          <textarea
            rows={3}
            placeholder="Describe the achievement... (Optional)"
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
          Faculty Guide
      ============================ */}

      <div className="space-y-4">

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

        <div className="space-y-2">

          <Label>
            Upload Certificate *
          </Label>

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

          {file && (
            <p className="text-xs text-muted-foreground">
              Selected: {file.name}
            </p>
          )}

        </div>

      </div>

      {/* ===========================
          Achievement Images
      ============================ */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold">
          Achievement Images
        </h2>

        <div className="space-y-2">

          <Label>
            Upload Images
          </Label>

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

                {images.map(
                  (image, index) => (
                    <div
                      key={`${image.name}-${index}`}
                      className="flex items-center justify-between rounded-md border bg-background px-3 py-2"
                    >
                      <span className="truncate text-sm">
                        📷 {image.name}
                      </span>

                      <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                        {(
                          image.size /
                          1024
                        ).toFixed(1)}{" "}
                        KB
                      </span>
                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ===========================
          External Reference
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