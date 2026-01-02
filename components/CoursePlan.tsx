"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import {
  Check,
  Maximize2,
  Minimize2,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import Course from "@/components/Course";
import type CoursePlanProps from "@/types/CoursePlanProps";

export default function CoursePlan({ gradeLevel, courses }: CoursePlanProps) {
  const [expanded, setExpanded] = useState(true);

  const totalCredits = courses.reduce((sum, course) => {
    return sum + course.credits;
  }, 0);

  let cardDescription = (
    <CardDescription className="flex gap-1 text-green-500 items-center">
      <Check size={18} /> {totalCredits} credits
    </CardDescription>
  );

  if (totalCredits == 0) {
    cardDescription = (
      <CardDescription className="flex gap-1 text-red-500 items-center">
        <OctagonAlert size={18} /> {totalCredits} credits
      </CardDescription>
    );
  } else if (totalCredits < 60) {
    cardDescription = (
      <CardDescription className="flex gap-1 text-yellow-500 items-center">
        <TriangleAlert size={18} /> {totalCredits} credits
      </CardDescription>
    );
  }

  return (
    <Card className="flex-1 max-w-90">
      <CardHeader>
        <CardTitle>{gradeLevel}th grade</CardTitle>
        {cardDescription}
        <CardAction
          className="hover:cursor-pointer"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </CardAction>
      </CardHeader>
      <CardContent className={`flex flex-col gap-2 ${!expanded && "hidden"}`}>
        {courses.map((course, index) => {
          return (
            <Course key={index} title={course.title} credits={course.credits} />
          );
        })}
      </CardContent>
    </Card>
  );
}
