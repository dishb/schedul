"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import {
  Minimize2,
  Maximize2,
  Plus,
  X,
  Save,
  Star,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Course from "@/components/Course";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ScrollArea } from "@/components/ui/scroll-area";
import type CoursePlanDoc from "@/types/CoursePlanDoc";
import type CourseDoc from "@/types/CourseDoc";
import { useSchoolCourses, useSchoolCoursesMap } from "@/hooks/useSchoolCourses";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type CoursePlanProps from "@/types/CoursePlanProps";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { addCourse, deleteCourse } from "@/lib/actions";

export default function CoursePlan({
  userId,
  schoolId,
  gradeLevel,
}: CoursePlanProps) {
  const [expanded, setExpanded] = useState(true);
  const [coursePlan, setCoursePlan] = useState<CoursePlanDoc | null>(null);
  const [radioSelect, setRadioSelect] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const catalog = useSchoolCourses(schoolId);
  const catalogMap = useSchoolCoursesMap(schoolId);
  const coursePlanRef = doc(
    db,
    "users",
    userId,
    "coursePlans",
    gradeLevel.toString(),
  );

  const selectedCourses = useMemo(() => {
    if (!coursePlan?.courses) return [];
    return (coursePlan.courses ?? [])
      .map((ref) => catalogMap.get(ref.id))
      .filter((c): c is CourseDoc => c != null);
  }, [coursePlan, catalogMap]);

  const courseCredits = coursePlan?.totalCredits ?? 0;
  const selectedCourseIds = selectedCourses.map((course) => course.courseId);

  function handleSelect() {
    if (selectedCourseIds.includes(radioSelect) || radioSelect === "") return;
    const course = catalogMap.get(radioSelect);
    if (!course) return;
    const courseRef = doc(db, "schools", schoolId, "courses", radioSelect);

    addCourse(coursePlanRef, courseRef, course.credits);
    setRadioSelect("");
    setSearchQuery("");
  }

  function handleDelete(index: number) {
    const course = selectedCourses[index];
    const courseRef = doc(
      db,
      "schools",
      schoolId,
      "courses",
      course.courseId,
    );

    deleteCourse(coursePlanRef, courseRef, course.credits);
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(coursePlanRef, (coursePlanSnap) => {
      if (!coursePlanSnap.exists()) {
        setCoursePlan(null);
        return;
      }
      const coursePlanData = coursePlanSnap.data() as CoursePlanDoc;
      setCoursePlan(coursePlanData);
    });

    return unsubscribe;
  }, [coursePlanRef]);

  return (
    <div className="flex-1">
      <Dialog>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{gradeLevel}th Grade</CardTitle>
            <CardDescription>{courseCredits ?? 0} credits</CardDescription>
            <CardAction onClick={() => setExpanded(!expanded)}>
              {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </CardAction>
          </CardHeader>

          {expanded && (
            <>
              <CardContent className="space-y-2">
                {selectedCourses.map((course, index) => (
                  <Course
                    key={course.courseId}
                    course={course}
                    onDelete={() => handleDelete(index)}
                  />
                ))}
              </CardContent>
              <CardFooter>
                {!coursePlan || coursePlan.totalCredits >= 70 ? (
                  <p className="w-full flex items-center justify-center text-sm">
                    Maximum credit limit reached.
                  </p>
                ) : (
                  <DialogTrigger asChild>
                    <Button className="w-full border-dashed" variant="outline">
                      <Plus /> Add course
                    </Button>
                  </DialogTrigger>
                )}
              </CardFooter>
            </>
          )}
        </Card>

        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Add course</DialogTitle>
            <DialogDescription>
              Select a course from your school&apos;s catalog and add it to your
              course plan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 items-center">
            <InputGroup>
              <InputGroupInput
                placeholder="Search by course name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <ScrollArea className="h-100 border rounded-lg p-2">
            <RadioGroup value={radioSelect} onValueChange={setRadioSelect}>
              {catalog
                .filter((course) => {
                  if (!searchQuery || searchQuery === "") return true;
                  const loweredSearchQuery = searchQuery.toLowerCase();
                  return course.title
                    .toLowerCase()
                    .includes(loweredSearchQuery);
                })
                .map((course) => {
                  const disabled = selectedCourseIds.includes(course.courseId);

                  return (
                    <div
                      key={course.courseId}
                      className="flex gap-2 items-center"
                    >
                      <RadioGroupItem
                        value={course.courseId}
                        id={course.courseId}
                        disabled={disabled}
                      >
                        {course.title} ({course.credits})
                      </RadioGroupItem>
                      <div className="flex flex-col">
                        <Label htmlFor={course.courseId}>{course.title}</Label>
                        <p className="text-xs text-muted-foreground">
                          {course.credits} credits
                        </p>
                      </div>
                      <div className="flex-1" />
                      {course.isHonors ? (
                        <Star className="text-yellow-500" size={16} />
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}

              {catalog.filter((course) => {
                if (!searchQuery || searchQuery == "") return true;
                const query = searchQuery.toLowerCase();
                return course.title.toLowerCase().includes(query);
              }).length === 0 && (
                <p className="justify-center items-center absolute h-full inset-0 flex text-sm text-muted-foreground">
                  No courses found.
                </p>
              )}
            </RadioGroup>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                <X /> Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => handleSelect()}>
                <Save /> Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
