"use client";

import type CourseProps from "@/types/CourseProps";
import { Button } from "@/components/ui/button";

export default function Course({ course, onDelete }: CourseProps) {
  return (
    <div className="flex p-4 justify-between border rounded-lg">
      <div className="flex flex-col">
        <p>{course.title}</p>
        <p className="text-muted-foreground text-xs">
          {course.credits} credits
        </p>
      </div>

      <Button onClick={onDelete}>Delete</Button>
    </div>
  );
}
