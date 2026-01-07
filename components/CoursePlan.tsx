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
import { useState, useEffect, useCallback } from "react";
import { Minimize2, Maximize2, Plus, X, Save, Star } from "lucide-react";
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

import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ScrollArea } from "@/components/ui/scroll-area";
import type CoursePlanDoc from "@/types/CoursePlanDoc";
import type CourseDoc from "@/types/CourseDoc";
import { useSchoolCourses } from "@/hooks/useSchoolCourses";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type CoursePlanProps from "@/types/CoursePlanProps";

export default function CoursePlan({
  userId,
  schoolId,
  gradeLevel,
}: CoursePlanProps) {
  const [expanded, setExpanded] = useState(true);
  const [coursePlan, setCoursePlan] = useState<CoursePlanDoc | null>(null);
  const [courses, setCourses] = useState<CourseDoc[]>([]);
  const [radioSelect, setRadioSelect] = useState("");
  const catalog = useSchoolCourses(schoolId);

  const isDisabled = (courseId: string) => selectedCourseIds.includes(courseId);

  const handleSelect = () => {
    if (isDisabled(radioSelect) || radioSelect === "") return;

    const ref = doc(db, "school", schoolId, "courses", radioSelect);
    addCourse(ref);
    setRadioSelect("");
  };

  const coursePlanRef = doc(
    db,
    "users",
    userId,
    "coursePlans",
    String(gradeLevel)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(coursePlanRef, async (snap) => {
      if (!snap.exists()) {
        setCoursePlan(null);
        setCourses([]);
        return;
      }

      const plan = snap.data() as CoursePlanDoc;
      setCoursePlan(plan);

      const resolvedCourses = await Promise.all(
        plan.courses.map(async (ref) => {
          const courseSnap = await getDoc(ref);
          const data = courseSnap.data();

          if (!data) return null;

          return {
            courseId: courseSnap.id,
            ...(data as Omit<CourseDoc, "courseId">),
          };
        })
      );

      setCourses(resolvedCourses.filter(Boolean) as CourseDoc[]);
    });

    return () => unsubscribe();
  }, [coursePlanRef]);

  const addCourse = useCallback(
    async (courseRef: DocumentReference) => {
      await runTransaction(db, async (tx) => {
        const planSnap = await tx.get(coursePlanRef);
        if (!planSnap.exists()) return;

        const plan = planSnap.data() as CoursePlanDoc;

        const courseSnap = await getDoc(courseRef);
        const credits = courseSnap.data()?.credits ?? 0;

        if (plan.totalCredits + credits > 70) {
          throw new Error("Credit limit exceeded");
        }

        tx.update(coursePlanRef, {
          courses: [...plan.courses, courseRef],
          totalCredits: plan.totalCredits + credits,
        });
      });
    },
    [coursePlanRef]
  );

  const replaceCourse = useCallback(
    async (index: number, newCourseRef: DocumentReference) => {
      await runTransaction(db, async (tx) => {
        const planSnap = await tx.get(coursePlanRef);
        if (!planSnap.exists()) return;

        const plan = planSnap.data() as CoursePlanDoc;

        const oldRef = plan.courses[index];

        const oldCredits = (await getDoc(oldRef)).data()?.credits ?? 0;
        const newCredits = (await getDoc(newCourseRef)).data()?.credits ?? 0;

        const newTotal = plan.totalCredits - oldCredits + newCredits;

        if (newTotal > 70) {
          throw new Error("Credit limit exceeded");
        }

        const updatedCourses = [...plan.courses];
        updatedCourses[index] = newCourseRef;

        tx.update(coursePlanRef, {
          courses: updatedCourses,
          totalCredits: newTotal,
        });
      });
    },
    [coursePlanRef]
  );

  const removeCourse = useCallback(
    async (index: number) => {
      await runTransaction(db, async (tx) => {
        const planSnap = await tx.get(coursePlanRef);
        if (!planSnap.exists()) return;

        const plan = planSnap.data() as CoursePlanDoc;
        const ref = plan.courses[index];

        const credits = (await getDoc(ref)).data()?.credits ?? 0;

        tx.update(coursePlanRef, {
          courses: plan.courses.filter((_, i) => i !== index),
          totalCredits: plan.totalCredits - credits,
        });
      });
    },
    [coursePlanRef]
  );

  const selectedCourseIds = courses.map((course) => course.courseId);

  return (
    <Dialog>
      <Card className="min-w-100">
        <CardHeader>
          <CardTitle>{gradeLevel}th Grade</CardTitle>
          <CardDescription>
            {coursePlan?.totalCredits ?? 0} credits
          </CardDescription>
          <CardAction onClick={() => setExpanded(!expanded)}>
            {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </CardAction>
        </CardHeader>

        {expanded && (
          <>
            <CardContent>
              {courses.map((course, index) => (
                <Course
                  key={course.courseId}
                  course={course}
                  onDelete={() => removeCourse(index)}
                />
              ))}
            </CardContent>

            <CardFooter>
              <DialogTrigger asChild>
                <Button
                  disabled={!coursePlan || coursePlan.totalCredits >= 70}
                  className="w-full border-dashed"
                  variant="outline"
                >
                  <Plus /> Add course
                </Button>
              </DialogTrigger>
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
        <ScrollArea className="h-100 border rounded-lg p-2">
          <RadioGroup value={radioSelect} onValueChange={setRadioSelect}>
            {catalog.map((course) => {
              const disabled = isDisabled(course.courseId);

              return (
                <div key={course.courseId} className="flex gap-2 items-center">
                  <RadioGroupItem
                    value={course.courseId}
                    id={course.courseId}
                    disabled={disabled}
                  >
                    {course.title} ({course.credits})
                    {disabled && " - already added"}
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
          </RadioGroup>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">
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
  );
}
