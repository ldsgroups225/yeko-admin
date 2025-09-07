"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createStudent(data: {
  first_name: string;
  last_name: string;
  id_number: string;
  parent_id: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  birth_place?: string;
  parent_phone?: string;
}) {
  try {
    const supabase = await createClient();

    const { data: result, error } = await supabase
      .from("students")
      .insert({
        first_name: data.first_name,
        last_name: data.last_name,
        id_number: data.id_number,
        parent_id: data.parent_id,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        nationality: data.nationality || "Cameroon",
        address: data.address,
        birth_place: data.birth_place,
        parent_phone: data.parent_phone,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to create student: ${error.message}`,
      };
    }

    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create student",
    };
  }
}

export async function updateStudent(
  id: string,
  data: {
    first_name?: string;
    last_name?: string;
    id_number?: string;
    parent_id?: string;
    date_of_birth?: string;
    gender?: string;
    nationality?: string;
    address?: string;
    birth_place?: string;
    parent_phone?: string;
  },
) {
  try {
    const supabase = await createClient();

    const { data: result, error } = await supabase
      .from("students")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to update student: ${error.message}`,
      };
    }

    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update student",
    };
  }
}

export async function deleteStudent(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: `Failed to delete student: ${error.message}`,
      };
    }

    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete student",
    };
  }
}

export async function toggleStudentStatus(id: string, isActive: boolean) {
  try {
    const supabase = await createClient();

    // Note: Students don't have an is_active field in the main students table
    // This would typically be handled through the student_school_class table
    // For now, we'll implement a placeholder that could be extended

    const { data: result, error } = await supabase
      .from("student_school_class")
      .update({ is_active: isActive })
      .eq("student_id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to toggle student status: ${error.message}`,
      };
    }

    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to toggle student status",
    };
  }
}

export async function bulkUpdateStudents(
  ids: string[],
  updates: {
    first_name?: string;
    last_name?: string;
    id_number?: string;
    parent_id?: string;
    date_of_birth?: string;
    gender?: string;
    nationality?: string;
    address?: string;
    birth_place?: string;
    parent_phone?: string;
  },
) {
  try {
    const supabase = await createClient();

    const { data: result, error } = await supabase
      .from("students")
      .update(updates)
      .in("id", ids)
      .select();

    if (error) {
      return {
        success: false,
        error: `Failed to bulk update students: ${error.message}`,
      };
    }

    revalidatePath("/users");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to bulk update students",
    };
  }
}

export async function bulkDeleteStudents(ids: string[]) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("students").delete().in("id", ids);

    if (error) {
      return {
        success: false,
        error: `Failed to bulk delete students: ${error.message}`,
      };
    }

    revalidatePath("/users");
    return { success: true, data: { deletedCount: ids.length } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to bulk delete students",
    };
  }
}
