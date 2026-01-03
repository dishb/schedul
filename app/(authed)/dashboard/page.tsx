"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import CoursePlan from "@/components/CoursePlan";
import type CourseProps from "@/types/CourseProps";
import useAuth from "@/hooks/useAuth";
import { db } from "@/lib/firebase";

type CoursePlansState = {
  ninth: CourseProps[];
  tenth: CourseProps[];
  eleventh: CourseProps[];
  twelfth: CourseProps[];
};

const initialState: CoursePlansState = {
  ninth: [],
  tenth: [],
  eleventh: [],
  twelfth: [],
};

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const [coursePlans, setCoursePlans] = useState<CoursePlansState>(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;

    async function fetchCoursePlans() {
      setLoading(true);

      try {
        const q = query(
          collection(db, "coursePlans"),
          where("user", "==", user?.uid),
          limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty && !cancelled) {
          const data = snapshot.docs[0].data();

          setCoursePlans({
            ninth: data.ninth ?? [],
            tenth: data.tenth ?? [],
            eleventh: data.eleventh ?? [],
            twelfth: data.twelfth ?? [],
          });
        }
      } catch (err) {
        console.error("Failed to load course plans", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCoursePlans();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  if (authLoading || loading) {
    return null;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full flex justify-evenly items-start">
        <CoursePlan gradeLevel={9} courses={coursePlans["ninth"]} />
        <CoursePlan gradeLevel={10} courses={coursePlans["tenth"]} />
        <CoursePlan gradeLevel={11} courses={coursePlans["eleventh"]} />
        <CoursePlan gradeLevel={12} courses={coursePlans["twelfth"]} />
      </div>
    </div>
  );
}
