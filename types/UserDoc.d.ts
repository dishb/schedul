import type { Timestamp, CollectionReference } from "firebase/firestore";

export default interface UserDoc {
  coursePlans: CollectionReference;
  createdAt: Timestamp;
  email: string;
  firstName: string;
  lastName: string;
  schoolId: number;
  schoolTitle: string;
  updatedAt: Timestamp;
  userId: string;
}
