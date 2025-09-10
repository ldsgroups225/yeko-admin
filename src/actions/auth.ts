"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInWithGoogle, signUpWithGoogle } from "@/services/oauthService";

/**
 * Server action for Google sign-in
 */
export async function signInWithGoogleAction() {
  try {
    const result = await signInWithGoogle();

    if (!result.success) {
      console.error("Sign-in failed:", result.error);
      return {
        success: false,
        error: result.error || "Erreur de connexion Google",
      };
    }

    if (result.url) {
      redirect(result.url);
    }

    return {
      success: true,
      data: { message: "Connexion Google réussie" },
    };
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite",
    };
  }
}

/**
 * Server action for Google sign-up
 */
export async function signUpWithGoogleAction() {
  try {
    const result = await signUpWithGoogle();

    if (!result.success) {
      console.error("Sign-up failed:", result.error);
      throw new Error(result.error || "Erreur d'inscription Google");
    }

    if (result.url) {
      redirect(result.url);
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Une erreur inattendue s'est produite",
    );
  }
}

/**
 * Server action for email/password sign-in
 */
export async function signInWithEmailAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      error: "Email et mot de passe requis",
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: "Identifiants invalides",
      };
    }

    // Success - the middleware will handle the redirect to dashboard
    return {
      success: true,
      data: { message: "Connexion réussie" },
    };
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite",
    };
  }
}

/**
 * Server action for email/password sign-up
 */
export async function signUpWithEmailAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user && !data.user.email_confirmed_at) {
      return {
        success: true,
        message: "Vérifiez votre email pour confirmer votre compte",
      };
    }

    redirect("/dashboard");
  } catch (error) {
    console.error("Sign-up error:", error);
    return { error: "Une erreur inattendue s'est produite" };
  }
}

/**
 * Server action for sign-out
 */
export async function signOutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/sign-in");
  } catch (error) {
    console.error("Sign-out error:", error);
    throw new Error("Erreur lors de la déconnexion");
  }
}

/**
 * Server action for password reset
 */
export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email requis");
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    // For successful password reset, we could redirect to a success page
    // or show a success message. For now, we'll just complete silently.
  } catch (error) {
    console.error("Password reset error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Une erreur inattendue s'est produite",
    );
  }
}
