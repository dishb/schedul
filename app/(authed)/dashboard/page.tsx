import CoursePlan from "@/components/CoursePlan";
import type CourseProps from "@/types/CourseProps";

const sampleCourses: CourseProps[] = [
  {
    title: "AP Calculus BC",
    credits: 10,
  },
];

export default function Page() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full flex justify-evenly items-start">
        <CoursePlan gradeLevel={11} courses={sampleCourses} />
      </div>
    </div>
  );
}
