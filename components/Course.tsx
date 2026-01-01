"use client";

import CourseCatalog from "@/components/CourseCatalog";
import type CourseProps from "@/types/CourseProps";
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
import { useState } from "react";
import { Plus, X, Pen, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Course({ title, credits }: CourseProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseProps | undefined>(
    { title: title, credits: credits }
  );

  return (
    <>
      {selectedCourse ? (
        <div className="flex justify-between border p-4 rounded-md">
          <div className="flex flex-col">
            <p>{selectedCourse.title}</p>
            <p className="text-muted-foreground text-xs">
              {selectedCourse.credits} credits
            </p>
          </div>

          <div className="flex items-center">
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
                <CourseCatalog />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">
                      <X /> Cancel
                    </Button>
                  </DialogClose>

                  <Button>
                    <Save /> Save
                  </Button>
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
            <Button className="w-full border-dashed" variant="outline">
              <Plus /> <p>Add course</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add course</DialogTitle>
              <DialogDescription>
                Search for a course and add it to your course plan from here.
              </DialogDescription>
            </DialogHeader>
            <CourseCatalog />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">
                  <X /> Cancel
                </Button>
              </DialogClose>

              <Button>
                <Save /> Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
