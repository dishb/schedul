import type CourseDoc from "@/types/CourseDoc";
import {
  getDoc,
  type DocumentReference,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type UserDoc from "@/types/UserDoc";
import type CoursePlanDoc from "@/types/CoursePlanDoc";

export async function getAGCompleted(uid: string) {
  const agCounter = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
  };

  const userData = await getUserInformation(uid);
  if (!userData) return agCounter;

  const coursePlansSnap = await getDocs(userData.coursePlans);
  if (coursePlansSnap.docs.length === 0) return agCounter;

  coursePlansSnap.docs.forEach((coursePlanDoc) => {
    if (!coursePlanDoc.exists()) return agCounter;
    const coursePlanData = coursePlanDoc.data() as CoursePlanDoc;

    coursePlanData.courses.forEach(async (courseRef) => {
      const courseDoc = await getDoc(courseRef);
      if (!courseDoc.exists()) return agCounter;

      const courseData = courseDoc.data() as CourseDoc;
      const key = courseData.subjectAreaCode as keyof typeof agCounter;
      if (Object.prototype.hasOwnProperty.call(agCounter, key)) {
        agCounter[key]++;
      }
    });
  });

  return agCounter;
}

export async function getUserInformation(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? (userSnap.data() as UserDoc) : null;

  return userData;
}

export async function getCourseCredits(courseRef: DocumentReference) {
  const courseSnapshot = await getDoc(courseRef);
  if (!courseSnapshot.exists()) return 0;
  const courseData = courseSnapshot.data() as CourseDoc;

  return courseData.credits ?? 0;
}

export async function addCourse(
  coursePlanRef: DocumentReference,
  courseRef: DocumentReference,
) {
  const courseCredits = await getCourseCredits(courseRef);

  await updateDoc(coursePlanRef, {
    courses: arrayUnion(courseRef),
    totalCredits: increment(courseCredits),
  });
}

export async function deleteCourse(
  coursePlanRef: DocumentReference,
  courseRef: DocumentReference,
) {
  const courseCredits = await getCourseCredits(courseRef);

  await updateDoc(coursePlanRef, {
    courses: arrayRemove(courseRef),
    totalCredits: increment(-1 * courseCredits),
  });
}
