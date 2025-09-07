"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createClass(data: {
  name: string;
  grade_id: number;
  school_id: string;
  max_student?: number;
  series?: string;
}) {
  try {
    const supabase = await createClient();

    const { data: result, error } = await supabase
      .from("classes")
      .insert({
        name: data.name,
        grade_id: data.grade_id,
        school_id: data.school_id,
        max_student: data.max_student || 30,
        series: data.series,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to create class: ${error.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create class",
    };
  }
}

export async function updateClass(
  id: string,
  data: {
    name?: string;
    grade_id?: number;
    max_student?: number;
    series?: string;
  },
) {
  try {
    const supabase = await createClient();

    const { data: result, error } = await supabase
      .from("classes")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to update class: ${error.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update class",
    };
  }
}

export async function deleteClass(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("classes").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: `Failed to delete class: ${error.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete class",
    };
  }
}

export async function toggleClassStatus(id: string, isActive: boolean) {
  try {
    const supabase = await createClient();

    const { data: result, error } = await supabase
      .from("classes")
      .update({ is_active: isActive })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to toggle class status: ${error.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to toggle class status",
    };
  }
}
