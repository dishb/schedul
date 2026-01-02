import CoursePlan from "@/components/CoursePlan";
import type CourseProps from "@/types/CourseProps";

const freshmanCourses: CourseProps[] = [
  {
    title: "Honors Algebra 2",
    credits: 10,
  },
  {
    title: "Physical Education",
    credits: 10,
  },
  {
    title: "Biology",
    credits: 10,
  },
  {
    title: "Spanish 2",
    credits: 10,
  },
  {
    title: "Health Education",
    credits: 5,
  },
  {
    title: "Global Studies",
    credits: 5,
  },
  {
    title: "Freshman English",
    credits: 10,
  },
];

const sophomoreCourses: CourseProps[] = [
  {
    title: "AP World History",
    credits: 10,
  },
  {
    title: "AP Computer Science A",
    credits: 10,
  },
  {
    title: "Honors Pre-Calculus",
    credits: 10,
  },
  {
    title: "Chemistry",
    credits: 10,
  },
  {
    title: "Sophomore English",
    credits: 10,
  },
  {
    title: "Digital Art",
    credits: 10,
  },
];

const juniorCourses: CourseProps[] = [
  {
    title: "AP Statistics",
    credits: 10,
  },
  {
    title: "AP Biology",
    credits: 10,
  },
  {
    title: "Physics",
    credits: 10,
  },
  {
    title: "Junior English",
    credits: 10,
  },
  {
    title: "AP Calculus BC",
    credits: 10,
  },
  {
    title: "AP Pyschology",
    credits: 10,
  },
];

const seniorCourses: CourseProps[] = [
  {
    title: "AP US Government",
    credits: 5,
  },
  {
    title: "AP Macroeconomics",
    credits: 5,
  },
  {
    title: "Expository Writing and Reading",
    credits: 10,
  },
  {
    title: "Cybersecurity",
    credits: 10,
  },
  {
    title: "Advanced Computer Science",
    credits: 10,
  },
  {
    title: "Multivariable Calculus",
    credits: 10,
  },
  {
    title: "AP Environmental Science",
    credits: 10,
  },
];

export default function Page() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full flex justify-evenly items-start">
        <CoursePlan gradeLevel={9} courses={freshmanCourses} />
        <CoursePlan gradeLevel={10} courses={sophomoreCourses} />
        <CoursePlan gradeLevel={11} courses={juniorCourses} />
        <CoursePlan gradeLevel={12} courses={seniorCourses} />
      </div>
    </div>
  );
}
