"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type CourseDoc from "@/types/CourseDoc";

const catalogCache = new Map<string, CourseDoc[]>();
const listenerCache = new Map<string, () => void>();
const subscribers = new Map<string, Set<() => void>>();

export function useSchoolCourses(schoolId: string) {
  const [courses, setCourses] = useState<CourseDoc[]>(() => {
    return catalogCache.get(schoolId) ?? [];
  });

  useEffect(() => {
    if (!schoolId) return;

    const notify = () => {
      setCourses(catalogCache.get(schoolId) ?? []);
    };

    if (!subscribers.has(schoolId)) {
      subscribers.set(schoolId, new Set());
    }
    subscribers.get(schoolId)!.add(notify);

    if (!listenerCache.has(schoolId)) {
      const ref = collection(db, "schools", schoolId, "courses");

      const unsubscribe = onSnapshot(ref, (snap) => {
        const data: CourseDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CourseDoc, "id">),
        }));

        catalogCache.set(schoolId, data);
        subscribers.get(schoolId)?.forEach((fn) => fn());
      });

      listenerCache.set(schoolId, unsubscribe);
    }

    return () => {
      subscribers.get(schoolId)?.delete(notify);

      if (subscribers.get(schoolId)?.size === 0) {
        subscribers.delete(schoolId);
        listenerCache.get(schoolId)?.();
        listenerCache.delete(schoolId);
        catalogCache.delete(schoolId);
      }
    };
  }, [schoolId]);

  return courses;
}
