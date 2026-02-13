"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type CourseDoc from "@/types/CourseDoc";

const catalogCache = new Map<string, CourseDoc[]>();
const listenerCache = new Map<string, () => void>();
const subscribers = new Map<string, Set<() => void>>();

export function useSchoolCourses(schoolId: string, gradeLevel: number) {
  const key = `${schoolId}:${gradeLevel}`;

  const [courses, setCourses] = useState<CourseDoc[]>(() => {
    return catalogCache.get(key) ?? [];
  });

  useEffect(() => {
    if (!schoolId || !gradeLevel) return;

    const notify = () => {
      setCourses(catalogCache.get(key) ?? []);
    };

    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }
    subscribers.get(key)!.add(notify);

    if (!listenerCache.has(key)) {
      const coursesRef = collection(db, "schools", schoolId, "courses");

      // const coursesQuery = query(
      //   coursesRef,
      //   where("gradeLevels", "array-contains", gradeLevel.toString()),
      // );

      const unsubscribe = onSnapshot(coursesRef, (snap) => {
        const data: CourseDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CourseDoc, "id">),
        }));

        catalogCache.set(key, data);
        subscribers.get(key)?.forEach((fn) => fn());
      });

      listenerCache.set(key, unsubscribe);
    }

    return () => {
      subscribers.get(key)?.delete(notify);

      if (subscribers.get(key)?.size === 0) {
        subscribers.delete(key);
        listenerCache.get(key)?.();
        listenerCache.delete(key);
        catalogCache.delete(key);
      }
    };
  }, [schoolId, gradeLevel, key]);

  return courses;
}
