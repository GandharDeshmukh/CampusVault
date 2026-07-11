import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import { toast } from "sonner";

import { uploadFaculty } from "@/services/faculty.service";

interface Props {
  department?: string;
  onUploadSuccess: () => void;
}

export default function AddFacultyDialog({
  department,
  onUploadSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [researchArea, setResearchArea] = useState("");

  const [photo, setPhoto] = useState<File | null>(null);

  async function handleUpload() {
    if (
      !name ||
      !designation ||
      !qualification
    ) {
      toast.warning("Please fill all required fields.");
      return;
    }

    try {
      await uploadFaculty(photo, {
        name,
        department: department ?? "",
        designation,
        qualification,
        experience,
        email,
        phone,
        research_area: researchArea,
        photo_name: null,
      });

      toast.success("Faculty added successfully.");

      onUploadSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add faculty.");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label>Designation</Label>
        <Input
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
      </div>

      <div>
        <Label>Qualification</Label>
        <Input
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
        />
      </div>

      <div>
        <Label>Experience (Years)</Label>
        <Input
          type="number"
          value={experience}
          onChange={(e) =>
            setExperience(Number(e.target.value))
          }
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <Label>Research Area</Label>
        <Input
          value={researchArea}
          onChange={(e) =>
            setResearchArea(e.target.value)
          }
        />
      </div>

      <div>
        <Label>Photo</Label>
        <Input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) =>
            setPhoto(e.target.files?.[0] ?? null)
          }
        />
      </div>

      <Button
        className="w-full"
        onClick={handleUpload}
      >
        Add Faculty
      </Button>
    </div>
  );
}