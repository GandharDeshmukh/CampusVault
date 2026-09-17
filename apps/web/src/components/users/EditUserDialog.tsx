import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import type { User } from "@/types/auth";
import { updateUser } from "@/services/user.service";

interface Props {
  user: User;
  onSuccess: () => void;
}

const ROLE_OPTIONS = [
  {
    value: "COLLEGE_ADMIN",
    label: "College Admin",
  },
  {
    value: "DEPARTMENT_COORDINATOR",
    label: "Department Coordinator",
  },
  {
    value: "ACHIEVEMENT_COORDINATOR",
    label: "Achievement Coordinator",
  },
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
  },
];

export default function EditUserDialog({
  user,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(user.name ?? "");

  const [role, setRole] = useState<User["role"]>(
    user.role
  );

  const [department, setDepartment] = useState(
    user.department ?? ""
  );

  const [isActive, setIsActive] = useState(
    user.is_active ?? true
  );

  const [loading, setLoading] = useState(false);

  const requiresDepartment =
    role === "DEPARTMENT_COORDINATOR" ||
    role === "ACHIEVEMENT_COORDINATOR";

  async function handleUpdate() {
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (requiresDepartment && !department.trim()) {
      toast.error("Department is required.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await updateUser(user.id, {
        name: name.trim(),
        role,
        department: department.trim() || null,
        is_active: isActive,
      });

      if (error) {
        throw error;
      }

      toast.success("User updated successfully.");

      setOpen(false);

      onSuccess();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update user."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Edit user"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              value={user.email ?? ""}
              disabled
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>

            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as User["role"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label>Department</Label>

            <Input
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              placeholder="Enter department"
              disabled={!requiresDepartment}
            />
          </div>

          {/* Active / Inactive */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">
                Active User
              </p>

              <p className="text-sm text-muted-foreground">
                Allow this user to access CampusVault.
              </p>
            </div>

            <Button
              type="button"
              variant={
                isActive
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setIsActive(!isActive)
              }
            >
              {isActive
                ? "Active"
                : "Inactive"}
            </Button>
          </div>

          {/* Update */}
          <Button
            className="w-full"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}