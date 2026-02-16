import {
  getDoc,
  type DocumentReference,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type UserDoc from "@/types/UserDoc";

const userInfoCache = new Map<string, UserDoc | null>();

export function setUserInfoCache(uid: string, data: UserDoc | null): void {
  userInfoCache.set(uid, data);
}

export function clearUserInfoCache(): void {
  userInfoCache.clear();
}

export async function getUserInformation(uid: string): Promise<UserDoc | null> {
  const cached = userInfoCache.get(uid);
  if (cached !== undefined) return cached;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? (userSnap.data() as UserDoc) : null;

  userInfoCache.set(uid, userData);
  return userData;
}

export async function addCourse(
  coursePlanRef: DocumentReference,
  courseRef: DocumentReference,
  credits: number,
) {
  await updateDoc(coursePlanRef, {
    courses: arrayUnion(courseRef),
    totalCredits: increment(credits),
  });
}

export async function deleteCourse(
  coursePlanRef: DocumentReference,
  courseRef: DocumentReference,
  credits: number,
) {
  await updateDoc(coursePlanRef, {
    courses: arrayRemove(courseRef),
    totalCredits: increment(-1 * credits),
  });
}
