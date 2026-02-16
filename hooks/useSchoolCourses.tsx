"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type CourseDoc from "@/types/CourseDoc";

const CATALOG_STORAGE_PREFIX = "schedul-catalog-";
const catalogCache = new Map<string, CourseDoc[]>();
const catalogFetchPromises = new Map<string, Promise<CourseDoc[]>>();

function getCatalogFromStorage(schoolId: string): CourseDoc[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${CATALOG_STORAGE_PREFIX}${schoolId}`);
    if (!raw) return null;
    const data = JSON.parse(raw) as CourseDoc[];
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

function setCatalogInStorage(schoolId: string, data: CourseDoc[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${CATALOG_STORAGE_PREFIX}${schoolId}`,
      JSON.stringify(data),
    );
  } catch {}
}

function loadSchoolCourses(schoolId: string): Promise<CourseDoc[]> {
  const cached = catalogCache.get(schoolId);
  if (cached !== undefined) return Promise.resolve(cached);

  const fromStorage = getCatalogFromStorage(schoolId);
  if (fromStorage !== null) {
    catalogCache.set(schoolId, fromStorage);
    return Promise.resolve(fromStorage);
  }

  const inFlight = catalogFetchPromises.get(schoolId);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const coursesRef = collection(db, "schools", schoolId, "courses");
    const snap = await getDocs(coursesRef);
    const data: CourseDoc[] = snap.docs.map((d) => d.data() as CourseDoc);
    catalogCache.set(schoolId, data);
    setCatalogInStorage(schoolId, data);
    catalogFetchPromises.delete(schoolId);
    return data;
  })();
  catalogFetchPromises.set(schoolId, promise);
  return promise;
}

export function useSchoolCourses(schoolId: string): CourseDoc[] {
  const [courses, setCourses] = useState<CourseDoc[]>(() => {
    return catalogCache.get(schoolId) ?? [];
  });

  useEffect(() => {
    if (!schoolId) return;

    let mounted = true;

    loadSchoolCourses(schoolId).then((data) => {
      if (mounted) setCourses(data);
    });

    return () => {
      mounted = false;
    };
  }, [schoolId]);

  return courses;
}

export function useSchoolCoursesMap(schoolId: string): Map<string, CourseDoc> {
  const courses = useSchoolCourses(schoolId);
  return useMemo(() => new Map(courses.map((c) => [c.courseId, c])), [courses]);
}
