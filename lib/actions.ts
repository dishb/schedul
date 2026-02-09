import type CourseDoc from "@/types/CourseDoc";
import {
  getDoc,
  type DocumentReference,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";

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
