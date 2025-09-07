"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ERole } from "@/types/role";

type FormState = {
  message?: string;
  errors?: Record<string, string[]>;
  success?: boolean;
};

// Remove all previous headmaster roles from a user
export async function removePreviousHeadmasterRoles(
  userId: string,
): Promise<FormState> {
  try {
    const supabase = await createClient();

    // Remove all existing headmaster roles for this user
    const { error: removeError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role_id", ERole.HEADMASTER);

    if (removeError) {
      return {
        message: `Erreur lors de la suppression des rôles précédents: ${removeError.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression des rôles précédents",
    };
  }
}

// Assign a headmaster to a school
export async function assignHeadmasterToSchool(
  schoolId: string,
  headmasterId: string,
): Promise<FormState> {
  try {
    const supabase = await createClient();

    // First, remove any previous headmaster roles for this user
    const removeResult = await removePreviousHeadmasterRoles(headmasterId);
    if (!removeResult.success) {
      return removeResult;
    }

    // Update or insert the user role with school assignment
    const { error: updateError } = await supabase.from("user_roles").upsert({
      user_id: headmasterId,
      role_id: ERole.HEADMASTER,
      school_id: schoolId,
    });

    if (updateError) {
      return {
        message: `Erreur lors de l'affectation du proviseur: ${updateError.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de l'affectation du proviseur",
    };
  }
}

// Remove headmaster assignment from a school
export async function removeHeadmasterFromSchool(
  schoolId: string,
  headmasterId: string,
): Promise<FormState> {
  try {
    const supabase = await createClient();

    // Remove the school assignment from the user role
    const { error } = await supabase
      .from("user_roles")
      .update({ school_id: null })
      .eq("user_id", headmasterId)
      .eq("role_id", ERole.HEADMASTER)
      .eq("school_id", schoolId);

    if (error) {
      return {
        message: `Erreur lors de la suppression de l'affectation: ${error.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression de l'affectation",
    };
  }
}

// Get the current headmaster of a school
export async function getSchoolHeadmaster(schoolId: string) {
  try {
    const supabase = await createClient();

    const { data: headmaster } = await supabase
      .from("user_roles")
      .select(`
        user_id,
        users!inner(
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq("role_id", ERole.HEADMASTER)
      .eq("school_id", schoolId)
      .single();

    if (!headmaster) {
      return { success: false, data: null };
    }

    return { success: true, data: headmaster };
  } catch {
    return { success: false, data: null };
  }
}
