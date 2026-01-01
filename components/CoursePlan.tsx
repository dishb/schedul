"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Save, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import Course from "@/components/Course";
import type CoursePlanProps from "@/types/CoursePlanProps";

export default function CoursePlan({ gradeLevel, courses }: CoursePlanProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="flex-1 max-w-90">
      <CardHeader>
        <CardTitle>{gradeLevel}th grade</CardTitle>
        <CardDescription className="flex gap-1 text-green-500 items-center">
          <Check size={18} /> 60 credits
        </CardDescription>
        <CardAction
          className="hover:cursor-pointer"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </CardAction>
      </CardHeader>
      {expanded && (
        <CardContent className="flex flex-col gap-2">
          {courses.map((course, index) => {
            return (
              <Course
                key={index}
                title={course.title}
                credits={course.credits}
              />
            );
          })}
        </CardContent>
      )}
      {expanded && (
        <CardFooter>
          <Button className="w-full" variant="secondary">
            <Save /> Save
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
