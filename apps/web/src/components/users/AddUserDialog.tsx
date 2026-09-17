import { useState } from "react";
import { toast } from "sonner";

import { createUser } from "@/services/user.service";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import { ROLE_OPTIONS } from "@/constants/roles";

interface Props {
  onSuccess: () => void;
}

export default function AddUserDialog({
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(
    ROLE_OPTIONS[1].value
  );
  const [department, setDepartment] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleCreate() {
  if (!name || !email || !password || !role) {
    toast.error("Please fill in all required fields.");
    return;
  }

  if (requiresDepartment && !department) {
    toast.error("Please enter a department.");
    return;
  }

  setLoading(true);

  try {
    const { error } = await createUser({
      name,
      email,
      password,
      role,
      department: department || undefined,
    });

    if (error) {
      throw error;
    }

    toast.success("User created successfully.");

    setName("");
    setEmail("");
    setPassword("");
    setRole(ROLE_OPTIONS[1].value);
    setDepartment("");

    onSuccess();
  } catch (error) {
    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to create user."
    );
  } finally {
    setLoading(false);
  }
}

  const requiresDepartment =
  role === "DEPARTMENT_COORDINATOR" ||
  role === "ACHIEVEMENT_COORDINATOR";

  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Enter name"
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Enter email"
        />
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Enter temporary password"
        />
      </div>

      <div>
        <Label>Role</Label>

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as typeof role)
          }
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          {ROLE_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {requiresDepartment && (
        <div>
          <Label>Department</Label>

          <Input
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            placeholder="Enter department"
          />
        </div>
      )}

      <Button
        className="w-full"
        disabled={loading}
        onClick={handleCreate}
      >
        {loading ? "Creating..." : "Create User"}
      </Button>
    </div>
  );
}