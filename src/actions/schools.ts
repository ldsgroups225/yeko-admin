"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { createSchoolSchema } from "@/lib/validations/schemas";

type Insert = Database["public"]["Tables"]["schools"]["Insert"];
type Update = Database["public"]["Tables"]["schools"]["Update"];
type FormState = {
  message?: string;
  errors?: Record<string, string[]>;
  success?: boolean;
};

export async function createSchool(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Extract form data
  const rawFormData = {
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    city: formData.get("city") as string,
    cycle_id: formData.get("cycle_id") as string,
    address: formData.get("address") as string,
    state_id: formData.get("state_id") as string, // Keep as string for validation
    is_technical_education: formData.get("is_technical_education") === "on",
    status: formData.get("status") as "private" | "public",
    image_url: formData.get("image_url") as string,
  };

  // Validate form data
  const validatedFields = createSchoolSchema.safeParse(rawFormData);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    // Format Zod errors to match expected structure
    const errors: Record<string, string[]> = {};

    validatedFields.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as string;
      if (!errors[fieldName]) {
        errors[fieldName] = [];
      }
      errors[fieldName].push(issue.message);
    });

    return { errors };
  }

  try {
    const supabase = await createClient();

    // Prepare data for insertion
    const data: Insert = {
      name: validatedFields.data.name,
      code: validatedFields.data.code,
      email: validatedFields.data.email,
      phone: validatedFields.data.phone,
      city: validatedFields.data.city,
      cycle_id: validatedFields.data.cycle_id,
      address: validatedFields.data.address,
      state_id: validatedFields.data.state_id, // Use the validated and transformed value
      is_technical_education: validatedFields.data.is_technical_education,
      status: validatedFields.data.status,
      image_url: validatedFields.data.image_url || null,
    };

    const { error } = await supabase.from("schools").insert(data);

    if (error) {
      return {
        message: `Erreur lors de la création de l'école: ${error.message}`,
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
          : "Erreur lors de la création de l'école",
    };
  }
}

export async function updateSchool(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Extract form data
  const rawFormData = {
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    city: formData.get("city") as string,
    cycle_id: formData.get("cycle_id") as string,
    address: formData.get("address") as string,
    state_id: formData.get("state_id") as string,
    is_technical_education: formData.get("is_technical_education") === "on",
    status: formData.get("status") as "private" | "public",
    image_url: formData.get("image_url") as string,
  };

  // Validate form data
  const validatedFields = createSchoolSchema.safeParse(rawFormData);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    // Format Zod errors to match expected structure
    const errors: Record<string, string[]> = {};

    validatedFields.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as string;
      if (!errors[fieldName]) {
        errors[fieldName] = [];
      }
      errors[fieldName].push(issue.message);
    });

    return { errors };
  }

  try {
    const supabase = await createClient();

    // Prepare data for update
    const data: Update = {
      name: validatedFields.data.name,
      code: validatedFields.data.code,
      email: validatedFields.data.email,
      phone: validatedFields.data.phone,
      city: validatedFields.data.city,
      cycle_id: validatedFields.data.cycle_id,
      address: validatedFields.data.address,
      state_id: validatedFields.data.state_id,
      is_technical_education: validatedFields.data.is_technical_education,
      status: validatedFields.data.status,
      image_url: validatedFields.data.image_url || null,
    };

    const { error } = await supabase.from("schools").update(data).eq("id", id);

    if (error) {
      return {
        message: `Erreur lors de la mise à jour de l'école: ${error.message}`,
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
          : "Erreur lors de la mise à jour de l'école",
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

export async function toggleSchoolStatus(
  id: string,
  currentStatus: "active" | "suspended",
) {
  try {
    const supabase = await createClient();
    const newStatus = currentStatus === "active" ? 3 : 1;

    const { error } = await supabase
      .from("schools")
      .update({ state_id: newStatus })
      .eq("id", id);

    if (error) {
      return {
        success: false,
        error: `Failed to update school status: ${error.message}`,
      };
    }

    revalidatePath("/schools");
    return { success: true, newStatus };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update school status",
    };
  }
}
