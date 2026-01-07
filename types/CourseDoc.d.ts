import type { Timestamp } from "firebase/firestore";

export default interface CourseDoc {
  courseId: string;
  courseLength: string;
  createdAt: Timestamp;
  credits: number;
  disciplineName: string;
  gradeLevels: number[];
  honorsTypeName: string;
  institutionId: number;
  isClassroomBased: boolean;
  isCte: boolean;
  isHonors: number;
  isOnline: boolean;
  subjectAreaCode: string;
  title: string;
  transcriptAbbreviations: string;
  updatedAt: Timestamp;
}
