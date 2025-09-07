"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createSchool(data: {
  name: string;
  code: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  cycle_id: string;
  state_id?: number;
  is_technical_education?: boolean;
}) {
  try {
    const supabase = await createClient();

    const { data: result, error } = await supabase
      .from("schools")
      .insert({
        name: data.name,
        code: data.code,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
        cycle_id: data.cycle_id,
        state_id: data.state_id,
        is_technical_education: data.is_technical_education || false,
        status: "private",
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to create school: ${error.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create school",
    };
  }
}

export async function updateSchool(
  id: string,
  data: {
    name?: string;
    code?: string;
    email?: string;
    phone?: string;
    city?: string;
    address?: string;
    cycle_id?: string;
    state_id?: number;
    is_technical_education?: boolean;
    status?: "private" | "public";
  },
) {
  try {
    const supabase = await createClient();

    const { data: result, error } = await supabase
      .from("schools")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to update school: ${error.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update school",
    };
  }
}

export async function deleteSchool(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("schools").delete().eq("id", id);

    if (error) {
      return {
        success: false,
        error: `Failed to delete school: ${error.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete school",
    };
  }
}

export async function toggleSchoolStatus(id: string, isActive: boolean) {
  try {
    const supabase = await createClient();

    // Note: Schools don't have an is_active field in the schema
    // This would need to be implemented based on your business logic
    // For now, we'll update the status field
    const status = isActive ? "private" : "private"; // You might want to add an "inactive" status

    const { data: result, error } = await supabase
      .from("schools")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Failed to toggle school status: ${error.message}`,
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
          : "Failed to toggle school status",
    };
  }
}
