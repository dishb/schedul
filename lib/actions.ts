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
  collection,
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

  const coursePlansRef = collection(db, "users", uid, "coursePlans");
  const coursePlansSnap = await getDocs(coursePlansRef);
  if (coursePlansSnap.docs.length === 0) return agCounter;

  for (const coursePlanDoc of coursePlansSnap.docs) {
    if (!coursePlanDoc.exists()) continue;
    const coursePlanData = coursePlanDoc.data() as CoursePlanDoc;

    const courseDocs = await Promise.all(
      coursePlanData.courses.map((courseRef) => getDoc(courseRef)),
    );

    for (const courseDoc of courseDocs) {
      if (!courseDoc.exists()) continue;

      const courseData = courseDoc.data() as CourseDoc;
      const key =
        courseData.subjectAreaCode.toLowerCase() as keyof typeof agCounter;
      if (Object.prototype.hasOwnProperty.call(agCounter, key)) {
        if (courseData.subjectAreaCode.toLowerCase() === "e") {
          agCounter[key] += courseData.credits;
        } else {
          agCounter[key] += courseData.credits;
        }
      }
    }
  }

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
