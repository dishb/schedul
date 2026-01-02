import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/invalid-verification-code":
      return "Invalid verification code.";
    case "auth/invalid-verification-id":
      return "Invalid verification ID.";
    case "auth/too-many-requests":
      return "Too many failed login attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled. Please contact support.";
    case "auth/weak-password":
      return "Password is too weak.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/missing-password":
      return "Password is required.";
    case "auth/missing-email":
      return "Email is required.";
    case "auth/quota-exceeded":
      return "Quota exceeded. Please try again later.";
    case "auth/app-deleted":
      return "This Firebase app has been deleted.";
    case "auth/app-not-authorized":
      return "This app is not authorized to use Firebase Authentication.";
    case "auth/argument-error":
      return "Invalid argument provided.";
    case "auth/invalid-api-key":
      return "Invalid API key. Please check your Firebase configuration.";
    case "auth/invalid-user-token":
      return "Invalid user token.";
    case "auth/project-not-found":
      return "Firebase project not found. Please check your configuration.";
    default:
      console.warn("Unknown Firebase auth error code:", errorCode);
      return `Authentication error: ${errorCode}. Please check your credentials and try again.`;
  }
}
