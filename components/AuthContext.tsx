"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import type AuthContextType from "@/types/AuthContextType";
import type SignUpData from "@/types/SignUpData";
import type LoginData from "@/types/LoginData";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
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
      },
    );

    return () => unsubscribe();
  }, []);

  const signIn = async (data: LoginData): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";

      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (data: SignUpData): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;

      let schoolId = 0;
      switch (data.schoolTitle) {
        case "Amador Valley High School":
          schoolId = 2754;
          break;
        case "Foothill High School":
          schoolId = 2755;
          break;
        case "Dublin High School":
          schoolId = 2751;
          break;
      }
      const userDoc = doc(db, "users", user.uid);

      await setDoc(userDoc, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        schoolTitle: data.schoolTitle,
        schoolId: schoolId,
        userId: user.uid,
      });

      for (const gradeLevel of ["9", "10", "11", "12"]) {
        const coursePlanRef = doc(
          db,
          "users",
          user.uid,
          "coursePlans",
          gradeLevel,
        );

        await setDoc(coursePlanRef, {
          gradeLevel: Number(gradeLevel),
          courses: [],
          totalCredits: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";

      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";

      console.error(errorMessage);
      throw new Error(errorMessage);
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
