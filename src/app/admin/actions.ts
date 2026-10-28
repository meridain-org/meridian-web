"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loginAction(_previous: string, formData: FormData): Promise<string> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password || email.length > 254 || password.length > 256) return "Enter a valid email and password.";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return "Supabase is not configured. Add its project URL and anon key to the environment.";
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return "Sign in failed. Check your credentials and try again.";
  const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).maybeSingle();
  if (role?.role !== "admin") {
    await supabase.auth.signOut();
    return "This account does not have CMS administrator access.";
  }
  redirect("/admin");
}
