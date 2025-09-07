"use client";

import { createClient } from "@/lib/supabase/client";
import { ERole } from "@/types";
import type { UserWithSchool } from "./dataService";

// Get available headmasters (client-side version)
export async function getAvailableHeadmastersClient(): Promise<
  UserWithSchool[]
> {
  const supabase = createClient();

  // Get users with HEADMASTER role who are not assigned to any school
  const { data: users, error } = await supabase
    .from("users")
    .select(`
      *,
      user_roles!inner(
        role_id,
        school_id,
        roles(name)
      )
    `)
    .eq("user_roles.role_id", ERole.HEADMASTER)
    .is("user_roles.school_id", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching available headmasters:", error);
    return [];
  }

  // Transform the data
  const usersWithSchool = users.map((user) => ({
    ...user,
    school_name: null,
    school_id: null,
    role: "Headmaster",
  }));

  return usersWithSchool;
}
