import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { supabase } from "@/lib/supabase";
import { nbaCriteria } from "@/data/nbaCriteria";
import { nbaRequirements } from "@/data/nbaRequirements";
import { uploadDocument } from "@/services/document.service";

interface Props {
  department?: string;
  criterion?: number;
  subcategory?: string;
  onUploadSuccess: () => void;
}

export default function UploadDocumentDialog({
  department,
  criterion,
  subcategory,
  onUploadSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [evidenceRequirement, setEvidenceRequirement] =
    useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const criterionData = criterion
    ? nbaCriteria.find((item) => item.id === criterion)
    : undefined;

  const subcategoryData =
    criterion && subcategory
      ? nbaRequirements[criterion]?.find(
          (item) =>
            item.subcategoryId === subcategory
        )
      : undefined;

  const evidenceRequirements =
    subcategoryData?.requirements ?? [];

  async function handleUpload() {
  if (!file) {
    setError("Please select a file.");
    return;
  }

  if (!title.trim()) {
    setError("Please enter a document title.");
    return;
  }

  if (!department) {
    setError("Department is required.");
    return;
  }

  if (criterion && subcategory && !evidenceRequirement) {
    setError("Please select an evidence requirement.");
    return;
  }

  try {
    setUploading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User is not authenticated.");
    }

    await uploadDocument(file, {
      title: title.trim(),
      description: description.trim(),
      file_name: file.name,
      category: category.trim(),
      department,
      criterion: criterion ?? null,
      subcategory: subcategory ?? null,
      evidence_requirement:
        evidenceRequirement || null,
      academic_year: academicYear.trim() || null,
      uploaded_by: user.id,
    });

    setFile(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setAcademicYear("");
    setEvidenceRequirement("");

    onUploadSuccess();
  } catch (error) {
    console.error("Document upload failed:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Failed to upload document."
    );
  } finally {
    setUploading(false);
  }
}

  return (
    <div className="space-y-5">
      {/* NBA Evidence Requirement */}

      {criterion && subcategory && (
        <div className="space-y-2">
          <Label>Evidence Requirement</Label>

          <select
            value={evidenceRequirement}
            onChange={(event) =>
              setEvidenceRequirement(event.target.value)
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">
              Select evidence requirement
            </option>

            {evidenceRequirements.map((requirement) => (
              <option
                key={requirement.id}
                value={requirement.id}
              >
                {requirement.title}
              </option>
            ))}
          </select>

          {criterionData && (
            <p className="text-xs text-muted-foreground">
              Criterion {criterionData.id} ·{" "}
              {criterionData.title}
            </p>
          )}
        </div>
      )}

      {/* File */}

      <div className="space-y-2">
        <Label>File</Label>

        <Input
          type="file"
          onChange={(event) => {
            setFile(
              event.target.files?.[0] ?? null
            );
          }}
        />
      </div>

      {/* Title */}

      <div className="space-y-2">
        <Label>Document Title</Label>

        <Input
          placeholder="Enter document title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />
      </div>

      {/* Description */}

      <div className="space-y-2">
        <Label>Description</Label>

        <textarea
          className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter document description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />
      </div>

      {/* Category */}

      <div className="space-y-2">
        <Label>Category</Label>

        <Input
          placeholder="e.g. Academic, Faculty, NBA"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        />
      </div>

      {/* Academic Year */}

      <div className="space-y-2">
        <Label>Academic Year</Label>

        <Input
          placeholder="e.g. 2025-26"
          value={academicYear}
          onChange={(event) =>
            setAcademicYear(event.target.value)
          }
        />
      </div>

      {/* Error */}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Upload */}

      <Button
        className="w-full"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading
          ? "Uploading..."
          : "Upload Document"}
      </Button>
    </div>
  );
}