import type { Timestamp, DocumentReference } from "firebase/firestore";

export default interface CoursePlanDoc {
  courses: DocumentReference[];
  createdAt: Timestamp;
  gradeLevel: number;
  totalCredits: number;
  updatedAt: Timestamp;
}
