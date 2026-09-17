import { useEffect, useState } from "react";

import UserSearch from "@/components/users/UserSearch";
import UsersTable from "@/components/users/UsersTable";
import AddUserModal from "@/components/users/AddUserModal";

import { getUsers } from "@/services/user.service";
import type { User } from "@/types/auth";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);

    const { data, error } = await getUsers();

    if (error) {
      console.error("Failed to load users:", error);
      setLoading(false);
      return;
    }

    setUsers(data ?? []);
    console.log("USERS FROM SUPABASE:", data);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Users
        </h1>

        <p className="text-muted-foreground">
          Manage users and their access to CampusVault.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <UserSearch
          value={search}
          onChange={setSearch}
        />

        <AddUserModal
          onSuccess={loadUsers}
        />
      </div>

      <UsersTable
        users={users}
        search={search}
        loading={loading}
        onRefresh={loadUsers}
      />
    </div>
  );
}