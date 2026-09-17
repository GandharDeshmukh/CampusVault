import "@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Missing authorization header",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user: currentUser },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError || !currentUser) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const adminClient = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    const { data: profile, error: profileError } =
      await adminClient
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({
          error: "User profile not found",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (profile.role !== "SUPER_ADMIN") {
      return new Response(
        JSON.stringify({
          error: "Only super admins can manage users",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.json();
    const action = body.action;

    // --------------------------------------------------
    // CREATE USER
    // --------------------------------------------------

    if (action === "create") {
      const {
        name,
        email,
        password,
        role,
        department,
      } = body;

      if (!name || !email || !password || !role) {
        return new Response(
          JSON.stringify({
            error:
              "Name, email, password and role are required",
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const normalizedRole = String(role)
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");

      const allowedRoles = [
        "SUPER_ADMIN",
        "COLLEGE_ADMIN",
        "DEPARTMENT_COORDINATOR",
        "ACHIEVEMENT_COORDINATOR",
      ];

      if (!allowedRoles.includes(normalizedRole)) {
        return new Response(
          JSON.stringify({
            error: "Invalid role",
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { data, error } =
        await adminClient.auth.admin.createUser({
          email: String(email).trim(),
          password,
          email_confirm: true,
          user_metadata: {
            name: String(name).trim(),
            role: normalizedRole,
            department: department
              ? String(department).trim()
              : null,
          },
        });

      if (error) {
        console.error(
          "Supabase Auth createUser error:",
          error
        );

        return new Response(
          JSON.stringify({
            error: error.message,
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          user: data.user,
        }),
        {
          status: 201,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // UPDATE
if (action === "update") {
  const {
    userId,
    name,
    role,
    department,
    is_active,
  } = body;

  if (!userId) {
    return new Response(
      JSON.stringify({
        error: "User ID is required",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (userId === currentUser.id) {
    return new Response(
      JSON.stringify({
        error: "You cannot edit your own account here",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const normalizedRole = role
    ? String(role)
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_")
    : undefined;

  const allowedRoles = [
    "SUPER_ADMIN",
    "COLLEGE_ADMIN",
    "DEPARTMENT_COORDINATOR",
    "ACHIEVEMENT_COORDINATOR",
  ];

  if (normalizedRole && !allowedRoles.includes(normalizedRole)) {
    return new Response(
      JSON.stringify({
        error: "Invalid role",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (name !== undefined) {
    updates.full_name = String(name).trim();
  }

  if (normalizedRole !== undefined) {
    updates.role = normalizedRole;
  }

  if (department !== undefined) {
    updates.department = department
      ? String(department).trim()
      : null;
  }

  if (is_active !== undefined) {
    updates.is_active = Boolean(is_active);
  }

  const { data, error } = await adminClient
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Update profile error:", error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      user: data,
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

    // --------------------------------------------------
    // DELETE USER
    // --------------------------------------------------

    if (action === "delete") {
      const { userId } = body;

      if (!userId) {
        return new Response(
          JSON.stringify({
            error: "User ID is required",
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (userId === currentUser.id) {
        return new Response(
          JSON.stringify({
            error: "You cannot delete your own account",
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { error } =
        await adminClient.auth.admin.deleteUser(userId);

      if (error) {
        console.error(
          "Supabase Auth deleteUser error:",
          error
        );

        return new Response(
          JSON.stringify({
            error: error.message,
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // --------------------------------------------------
    // INVALID ACTION
    // --------------------------------------------------

    return new Response(
      JSON.stringify({
        error: "Invalid action",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("manage-user error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});