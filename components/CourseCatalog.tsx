"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search, Star } from "lucide-react";
import courses from "@/data/courses/2754.json";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CourseCatalog() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <InputGroup>
        <InputGroupInput placeholder="Search courses by name..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <ScrollArea className="h-100 border rounded-md">
        <RadioGroup>
          {courses.map((course, index) => (
            <div
              key={index}
              className="flex p-2 items-center w-full justify-between"
            >
              <div className="flex gap-2 items-center">
                <RadioGroupItem
                  value={`${index}`}
                  id={`${index}`}
                  className="hover:cursor-pointer"
                />
                <Label
                  className="flex flex-col items-start gap-0 hover:cursor-pointer"
                  htmlFor={`${index}`}
                >
                  <p className="text-sm">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.courseLength}
                  </p>
                </Label>
              </div>

              {course.isHonors ? (
                <Star size={18} className="text-yellow-500" />
              ) : (
                <></>
              )}
            </div>
          ))}
        </RadioGroup>
      </ScrollArea>
    </div>
  );
}
