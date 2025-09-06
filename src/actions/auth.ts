import { redirect } from "next/navigation";
import { signInWithGoogle, signUpWithGoogle } from "@/services/oauthService";

/**
 * Server action for Google sign-in
 */
export async function signInWithGoogleAction() {
  "use server";

  try {
    const result = await signInWithGoogle();

    if (!result.success) {
      // In a real app, you'd want to handle errors better, perhaps with error boundaries or state
      console.error("Sign-in failed:", result.error);
      return;
    }

    if (result.url) {
      redirect(result.url);
    }
  } catch (error) {
    console.error("Sign-in error:", error);
  }
}

/**
 * Server action for Google sign-up
 */
export async function signUpWithGoogleAction() {
  "use server";

  try {
    const result = await signUpWithGoogle();

    if (!result.success) {
      console.error("Sign-up failed:", result.error);
      return;
    }

    if (result.url) {
      redirect(result.url);
    }
  } catch (error) {
    console.error("Sign-up error:", error);
  }
}
