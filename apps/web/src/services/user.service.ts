import { supabase } from "@/lib/supabase";
import type { User } from "@/types/auth";

export async function getUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = data?.map((profile) => ({
    ...profile,
    name: profile.full_name,
  }));

  return {
    data: users as User[] | null,
    error,
  };
}

export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const user = data
    ? {
        ...data,
        name: data.full_name,
      }
    : null;

  return {
    data: user as User | null,
    error,
  };
}

export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, "id">>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  return {
    data: data as User | null,
    error,
  };
}

export async function deleteUser(userId: string) {
  const { data, error } = await supabase.functions.invoke(
    "manage-user",
    {
      body: {
        action: "delete",
        userId,
      },
    }
  );

  return {
    data,
    error,
  };
}


export async function createUser(user: {
  name: string;
  email: string;
  password: string;
  role: User["role"];
  department?: string;
}) {
  const { data, error } = await supabase.functions.invoke(
    "manage-user",
    {
      body: {
        action: "create",
        ...user,
      },
    }
  );

  if (error) {
    console.error("CREATE USER ERROR:", error);

    if ("context" in error && error.context instanceof Response) {
      try {
        const body = await error.context.json();
        console.error("EDGE FUNCTION RESPONSE:", body);

        return {
          data: null,
          error: new Error(
            body?.error || "Failed to create user"
          ),
        };
      } catch {
        // Ignore response parsing errors
      }
    }
  }

  return {
    data,
    error,
  };
}