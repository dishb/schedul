"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type AuthError,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import type AuthContextType from "@/types/AuthContextType";
import { getAuthErrorMessage } from "@/lib/utils";
import type SignUpData from "@/types/SignUpData";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("An auth state change error occurred:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Firebase sign-in error:", error);

      if (error && typeof error === "object" && "code" in error) {
        const authError = error as AuthError;
        console.error("Auth error code:", authError.code);
        console.error("Auth error message:", authError.message);
        throw new Error(getAuthErrorMessage(authError.code));
      }

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      throw new Error(errorMessage);
    }
  };

  const signUp = async (data: SignUpData): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      try {
        await setDoc(doc(db, "users", user.uid), {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreError) {
        console.error(
          "Failed to save user profile to Firestore:",
          firestoreError
        );
      }
    } catch (error) {
      console.error("Firebase sign-up error:", error);

      if (error && typeof error === "object" && "code" in error) {
        const authError = error as AuthError;
        console.error("Auth error code:", authError.code);
        console.error("Auth error message:", authError.message);
        throw new Error(getAuthErrorMessage(authError.code));
      }

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
