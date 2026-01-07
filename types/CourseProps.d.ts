import type CourseDoc from "@/types/CourseDoc";

export default interface CourseProps {
  course: CourseDoc;
  onDelete: () => void;
}
