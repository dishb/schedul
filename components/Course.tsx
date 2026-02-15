"use client";

import type CourseProps from "@/types/CourseProps";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function Course({ course, onDelete }: CourseProps) {
  return (
    <div className="flex gap-1 p-4 justify-between border rounded-lg">
      <div className="flex flex-col">
        <div className="flex gap-2 items-center">
          <p className="text-sm">{course.title}</p>
        </div>
        <p className="text-muted-foreground text-xs mt-1">
          {course.credits} credits
        </p>
      </div>

      <Button variant="ghost" onClick={onDelete}>
        <Trash />
      </Button>
    </div>
  );
}
