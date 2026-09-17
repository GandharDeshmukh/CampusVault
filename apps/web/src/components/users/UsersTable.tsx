import type { User } from "@/types/auth";

import UserActions from "@/components/users/UserActions";

interface Props {
  users: User[];
  search: string;
  loading: boolean;
  onRefresh: () => void;
}

export default function UsersTable({
  users,
  search,
  loading,
  onRefresh,
}: Props) {
  const searchText = search.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const name = user.name ?? "";
    const email = user.email ?? "";
    const role = user.role ?? "";
    const department = user.department ?? "";

    return (
      name.toLowerCase().includes(searchText) ||
      email.toLowerCase().includes(searchText) ||
      role.toLowerCase().includes(searchText) ||
      department.toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="rounded-xl border bg-muted/20 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Loading users...
        </p>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/20 py-16 text-center">
        <h3 className="text-lg font-semibold">
          No users found
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {searchText
            ? "Try a different search."
            : "Add your first user."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left">
              User
            </th>

            <th className="px-4 py-3 text-left">
              Role
            </th>

            <th className="px-4 py-3 text-left">
              Department
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => {
            const name = user.name ?? "Unnamed User";
            const email = user.email ?? "No email";

            return (
              <tr
                key={user.id}
                className="border-t hover:bg-muted/30"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted font-medium">
                      {name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium">
                        {name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {user.role ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {user.department ?? "-"}
                </td>

                <td className="px-4 py-3 text-right">
                  <UserActions
                    user={user}
                    onDeleted={onRefresh}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}