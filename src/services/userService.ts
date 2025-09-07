import { forbidden, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ERole, type Profile } from "@/types";

/**
 * Gets the current authenticated user's basic information.
 *
 * @returns {Promise<string>} The current user ID
 * @throws Redirects to /sign-in if not authenticated
 */
export async function getUserId(): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.error("Authentication error:", error);
    redirect("/sign-in");
  }

  return data.user.id;
}

/**
 * Checks if a user has a specific role
 *
 * @param userId - The user ID to check
 * @param roleId - The role ID to verify
 * @returns Promise<boolean> - True if user has the role
 */
export async function hasRole(userId: string, roleId: ERole): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", userId)
    .eq("role_id", roleId)
    .maybeSingle();

  if (error) {
    console.error("Role check error:", error);
    return false;
  }

  return !!data;
}

/**
 * Gets all roles for a specific user
 *
 * @param userId - The user ID to check
 * @returns Promise<ERole[]> - Array of user roles
 */
export async function getUserRoles(userId: string): Promise<ERole[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }

  return data?.map((item) => item.role_id as ERole) || [];
}

/**
 * Admin-only guard function
 *
 * @param userId - The user ID to check
 * @throws Uses forbidden() for proper 403 handling if not admin
 */
export async function adminOnlyGuard(userId: string): Promise<void> {
  try {
    const isAdmin = await hasRole(userId, ERole.SUPER_ADMIN);

    if (!isAdmin) {
      console.warn(`Access denied for user ${userId} - admin role required`);
      forbidden();
    }
  } catch (error) {
    console.error("Admin guard error:", error);
    forbidden();
  }
}

/**
 * Multi-role guard function
 *
 * @param userId - The user ID to check
 * @param allowedRoles - Array of roles that can access the resource
 * @throws Uses forbidden() for proper 403 handling if user doesn't have required roles
 */
export async function roleGuard(
  userId: string,
  allowedRoles: ERole[],
): Promise<void> {
  try {
    const userRoles = await getUserRoles(userId);
    const hasRequiredRole = allowedRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRequiredRole) {
      console.warn(
        `Access denied for user ${userId} - required roles: ${allowedRoles.join(", ")}`,
      );
      forbidden();
    }
  } catch (error) {
    console.error("Role guard error:", error);
    forbidden();
  }
}

/**
 * Enhanced function to check if user has admin privileges
 * Returns boolean instead of throwing
 *
 * @param userId - The user ID to check
 * @returns Promise<boolean> - True if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    return await hasRole(userId, ERole.SUPER_ADMIN);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Fetches the complete user profile including role information.
 * Enhanced version with better error handling and role information.
 *
 * @param userId - Optional user ID (defaults to current user)
 * @returns {Promise<Profile>} The user's complete profile
 * @throws Redirects to appropriate pages on error
 */
export async function fetchUserProfile(userId?: string): Promise<Profile> {
  try {
    const supabase = await createClient();
    const targetUserId = userId || (await getUserId());

    // If checking another user's profile, ensure current user has admin rights
    if (userId && userId !== targetUserId) {
      const currentUserId = await getUserId();
      await adminOnlyGuard(currentUserId);
    }

    // Get user basic profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, phone, avatar_url")
      .eq("id", targetUserId)
      .single();

    if (profileError || !profile) {
      console.error("Profile fetch error:", profileError);
      forbidden();
    }

    // Build enhanced user profile
    const userProfile: Profile = {
      id: targetUserId,
      email: profile.email || "",
      firstName: profile.first_name ?? "",
      lastName: profile.last_name ?? "",
      fullName: `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim(),
      phoneNumber: profile.phone ?? "",
      avatarUrl: profile.avatar_url || null,
    };

    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    redirect("/forbidden");
  }
}

/**
 * Lightweight version to get current user profile for admin users only
 *
 * @returns {Promise<Profile>} The admin user's profile
 */
export async function fetchAdminProfile(): Promise<Profile> {
  const userId = await getUserId();
  await adminOnlyGuard(userId);
  return fetchUserProfile(userId);
}

/**
 * Updates user profile information
 *
 * @param userId - User ID to update
 * @param updates - Profile fields to update
 * @returns Promise<boolean> - Success status
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<
    Pick<Profile, "firstName" | "lastName" | "phoneNumber" | "avatarUrl">
  >,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const currentUserId = await getUserId();

    // Users can only update their own profile, unless they're admin
    if (userId !== currentUserId) {
      await adminOnlyGuard(currentUserId);
    }

    const { error } = await supabase
      .from("users")
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phoneNumber,
        avatar_url: updates.avatarUrl,
      })
      .eq("id", userId);

    if (error) {
      console.error("Profile update error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
}
