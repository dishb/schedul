"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { Plus, X, Pen, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type CourseProps from "@/types/CourseProps";

export default function Course({ title, credits }: CourseProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseProps | undefined>(
    {
      title: title,
      credits: credits,
    }
  );
  const [selectedRadio, setSelectedRadio] = useState<string | undefined>(title);
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(query));
  }, [search]);

  const creditMap: Record<string, number> = {
    "Full Year": 10,
    "Half Year": 5,
    "Two Years": 20,
  };

  return (
    <>
      {selectedCourse ? (
        <div className="flex justify-between border p-4 rounded-md gap-2">
          <div className="flex flex-col min-w-0">
            <p className="truncate">{selectedCourse.title}</p>
            <p className="text-muted-foreground text-xs">
              {selectedCourse.credits} credits
            </p>
          </div>

          <div className="flex items-center shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <Pen />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit course</DialogTitle>
                  <DialogDescription>
                    Search for a course and replace the currently selected one
                    from here.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 w-full">
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Search courses by name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <InputGroupAddon>
                      <Search />
                    </InputGroupAddon>
                  </InputGroup>
                  <ScrollArea className="h-100 border rounded-md">
                    <RadioGroup
                      defaultValue={selectedRadio}
                      onValueChange={(value) => {
                        setSelectedRadio(value);
                      }}
                    >
                      {filteredCourses.map((course, index) => (
                        <div
                          key={index}
                          className="flex p-2 items-center w-full justify-between"
                        >
                          <div className="flex gap-2 items-center">
                            <RadioGroupItem
                              value={course.title}
                              id={course.title}
                              className="hover:cursor-pointer"
                            />
                            <Label
                              className="flex flex-col items-start gap-0 hover:cursor-pointer"
                              htmlFor={course.title}
                            >
                              <p className="text-sm">{course.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {creditMap[course.courseLength] ?? 0} credits
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
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedRadio(title)}
                    >
                      <X /> Cancel
                    </Button>
                  </DialogClose>

                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        const constructedCourse: CourseProps = {
                          title: selectedRadio || "",
                          credits: 10,
                        };

                        setSelectedCourse(constructedCourse);
                      }}
                    >
                      <Save /> Save
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              onClick={() => setSelectedCourse(undefined)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-dashed">
              <Plus /> Add course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add course</DialogTitle>
              <DialogDescription>
                Search for a course and add it to your course list from here.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 w-full">
              <InputGroup>
                <InputGroupInput
                  placeholder="Search courses by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <ScrollArea className="h-100 border rounded-md">
                <RadioGroup
                  onValueChange={(value) => {
                    setSelectedRadio(value);
                  }}
                >
                  {filteredCourses.map((course, index) => (
                    <div
                      key={index}
                      className="flex p-2 items-center w-full justify-between"
                    >
                      <div className="flex gap-2 items-center">
                        <RadioGroupItem
                          value={course.title}
                          id={course.title}
                          className="hover:cursor-pointer"
                        />
                        <Label
                          className="flex flex-col items-start gap-0 hover:cursor-pointer"
                          htmlFor={course.title}
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
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedRadio(title)}
                >
                  <X /> Cancel
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button
                  onClick={() => {
                    const constructedCourse: CourseProps = {
                      title: selectedRadio || "",
                      credits: 10,
                    };

                    setSelectedCourse(constructedCourse);
                  }}
                >
                  <Save /> Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
