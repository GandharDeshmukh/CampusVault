import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useEffect } from "react";
import { getDepartments } from "@/services/department.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { toast } from "sonner";

import { uploadDocument } from "@/services/document.service";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  department?: string;

  // NBA
  criterion?: number;
  subcategory?: string;

  onUploadSuccess: () => void;
}

const categories = [
  "Accreditation",
  "Syllabus",
  "Question Papers",
  "Lab Manuals",
  "Faculty",
  "Reports",
  "Circulars",
  "Other",
];

const academicYears = [
  "2026-27",
  "2025-26",
  "2024-25",
  "2023-24",
];

interface Department {
  id: string;
  name: string;
}

export default function UploadDocumentDialog({
  department,
  criterion,
  subcategory,
  onUploadSuccess,
}: Props) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState<string | null>(null);

  const [departmentId, setDepartmentId] = useState(
    department ?? ""
  );

  const [departments, setDepartments] = useState<
    Department[]
  >([]);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    const { data, error } =
      await getDepartments();

    if (error) {
      console.error(error);
      return;
    }

    setDepartments(data ?? []);
  }

  async function handleUpload() {
    if (
      !title ||
      !category ||
      !academicYear ||
      !departmentId ||
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
      await uploadDocument(file, {
  title,
  description: "",
  category,
  department: departmentId,

  // NBA
  criterion: criterion ?? null,
  subcategory: subcategory ?? null,

  uploaded_by: user.id,
  file_name: "",
});

      toast.success("Document uploaded successfully!");

      setTitle("");
      setCategory("");
      setAcademicYear(null);
      setDepartmentId("");
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

      <div className="space-y-2 w-full">
        <Label>Category</Label>

        <Select
          value={category}
          onValueChange={setCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>

          <SelectContent>
            {categories.map((item) => (
              <SelectItem
                key={item}
                value={item}
              >
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 w-full">
        <Label>Department</Label>

        <Select
          value={departmentId}
          onValueChange={(v: string | null) =>
            setDepartmentId(v ?? "")
          }
          disabled={!!department}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>

          <SelectContent>
            {departments.map((dept) => (
              <SelectItem
                key={dept.id}
                value={dept.name}
              >
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 w-full">
        <Label>Academic Year</Label>

        <Select
          value={academicYear}
          onValueChange={setAcademicYear}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Academic Year" />
          </SelectTrigger>

          <SelectContent>
            {academicYears.map((year) => (
              <SelectItem
                key={year}
                value={year}
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Choose File</Label>

        <Input
          type="file"
          onChange={(e) =>
            setFile(e.target.files?.[0] ?? null)
          }
        />

        {file && (
          <p className="text-sm text-muted-foreground">
            📄 {file.name}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          type="button"
        >
          Cancel
        </Button>

        <Button onClick={handleUpload}>
          Upload Document
        </Button>
      </div>
    </div>
  );
}