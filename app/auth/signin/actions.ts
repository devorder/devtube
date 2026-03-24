"use server";
import { signIn } from "@/auth";
export async function signInAction(prevState: unknown, formData: FormData) {
  try {
    return signIn("credentials", formData);
  } catch (error) {
    return {
      error: "Failed to sign in. Please try again later....",
    };
  }
}
