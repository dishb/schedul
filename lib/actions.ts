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

export async function getUserInformation(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? (userSnap.data() as UserDoc) : null;

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
