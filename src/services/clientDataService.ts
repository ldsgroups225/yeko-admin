"use client";

import { createClient } from "@/lib/supabase/client";
import { formatFullName } from "@/lib/utils";
import { ERole } from "@/types";

export type AvailableUsers = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  schoolName: string | null;
  hasHeadmasterRole: boolean;
  hasDirectorRole: boolean;
};

// Enhanced type definitions
type DatabaseUser = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

type DatabaseSchool = {
  name: string;
};

type DatabaseUserRole = {
  user_id: string;
  school_id: string | null;
  schools: DatabaseSchool | null;
  role_id: ERole;
  users: DatabaseUser | null;
};

type GroupedUserData = {
  user: DatabaseUser;
  roles: Array<{
    school_id: string | null;
    school_name: string | null;
    role_id: ERole;
  }>;
};

export type AvailableHeadmaster = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  school_name: string | null;
  school_id: string | null;
  hasHeadmasterRole: boolean;
  hasDirectorRole: boolean;
};

// Role checking utility with better type safety
function hasRole(userRoles: { role_id: ERole }[], desiredRole: ERole): boolean {
  return userRoles.some((userRole) => userRole.role_id === desiredRole);
}

// Data transformation utility
function transformUserData(groupedUsers: Record<string, GroupedUserData>) {
  return Object.entries(groupedUsers)
    .filter(([_, userData]) => userData.user) // Filter out users without user data
    .map(([userId, userData]) => {
      const { user, roles } = userData;

      const hasHeadmasterRole = hasRole(roles, ERole.HEADMASTER);
      const hasDirectorRole = hasRole(roles, ERole.DIRECTOR);

      return {
        id: userId,
        full_name: formatFullName(user.first_name, user.last_name, user.email),
        email: user.email || "",
        avatar_url: user.avatar_url,
        school_name: roles.find((role) => role.school_id)?.school_name || null,
        school_id: roles.find((role) => role.school_id)?.school_id || null,
        hasHeadmasterRole,
        hasDirectorRole,
      };
    });
}

/**
 * Fetches available headmasters and directors from the database
 * Excludes users with SUPER_ADMIN, TEACHER, or CASHIER roles
 *
 * @returns Promise<UserWithSchool[]> Array of users with their role information
 */
export async function getAvailableHeadmastersClient(): Promise<
  AvailableHeadmaster[]
> {
  const excludedRoles = [ERole.SUPER_ADMIN, ERole.TEACHER, ERole.CASHIER];
  const supabase = createClient();

  try {
    const { data: roles, error } = await supabase
      .from("user_roles")
      .select(`
        user_id,
        school_id,
        role_id,
        users (
          first_name,
          last_name,
          email,
          avatar_url
        ),
         schools (
          name
        )
      `)
      .not("role_id", "in", `(${excludedRoles.join(",")})`);

    if (error) {
      console.error("Database error fetching available headmasters:", error);
      throw new Error(`Failed to fetch headmasters: ${error.message}`);
    }

    if (!roles || roles.length === 0) {
      return [];
    }

    // Group users by user_id to handle multiple roles per user
    const groupedUsers = roles.reduce(
      (acc: Record<string, GroupedUserData>, role: DatabaseUserRole) => {
        const userId = role.user_id;

        // Skip if no user data is available
        if (!role.users) {
          return acc;
        }

        if (!acc[userId]) {
          acc[userId] = {
            user: role.users,
            roles: [],
          };
        }

        acc[userId].roles.push({
          school_id: role.school_id,
          school_name: role.schools?.name || null,
          role_id: role.role_id,
        });

        return acc;
      },
      {},
    );

    return transformUserData(groupedUsers);
  } catch (error) {
    console.error("Error in getAvailableHeadmastersClient:", error);

    // Return empty array instead of throwing to prevent app crashes
    // In a production app, you might want to show a toast notification here
    return [];
  }
}
