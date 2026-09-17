import { supabase } from "@/lib/supabase";

export async function signIn(
  email: string,
  password: string
) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  return await supabase.auth.getUser();
}

export async function getCurrentSession() {
  return await supabase.auth.getSession();
}

export async function sendPasswordReset(
  email: string
) {
  return await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${window.location.origin}/reset-password`,
    }
  );
}

export async function updatePassword(
  password: string
) {
  return await supabase.auth.updateUser({
    password,
  });
}