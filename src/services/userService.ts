import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ERole, type Profile } from "@/types";

/**
 * Gets the current authenticated user's basic information.
 *
 * @returns {Promise<string>} The current user ID or null if not authenticated
 */
export async function getUserId(): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return redirect("/sign-in");
  }

  return data.user.id;
}

export async function adminOnlyGuard(userId: string): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", userId)
    .eq("role_id", ERole.SUPER_ADMIN)
    .single();

  if (error || !data) {
    return redirect("/unauthorized");
  }
}

/**
 * Fetches the complete user profile including role information for any user type.
 * Now supports directors, teachers, and parents with role-based data loading.
 *
 * @returns {Promise<IUserProfileDTO>} The user's complete profile
 * @throws {Error} With message 'Unauthorized' if user is not authenticated
 * @throws {Error} With message 'Profile not found' if profile fetch fails
 */
export async function fetchUserProfile(): Promise<Profile> {
  try {
    const supabase = await createClient();
    const userId = await getUserId();
    await adminOnlyGuard(userId);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get user basic profile and ALL roles (removed DIRECTOR restriction)
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, phone, avatar_url")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw new Error("Profile not found");
    }

    // Build base user profile
    return {
      id: userId,
      email: profile.email || "",
      firstName: profile.first_name ?? "",
      lastName: profile.last_name ?? "",
      fullName: `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim(),
      phoneNumber: profile.phone ?? "",
      avatarUrl: profile.avatar_url || null,
    };
  } catch (error) {
    // Re-throw known errors with their original messages
    if (
      error instanceof Error &&
      (error.message === "Unauthorized" ||
        error.message === "Profile not found")
    ) {
      throw error;
    }

    // Handle unexpected errors
    console.error("Unexpected error in fetchUserProfile:", error);
    throw new Error("Failed to fetch user profile");
  }
}
