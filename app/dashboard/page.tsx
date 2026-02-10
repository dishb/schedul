"use client";

import { useEffect, useState } from "react";
import CoursePlan from "@/components/CoursePlan";
import useAuth from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { getUserInformation, getAGCompleted } from "@/lib/actions";
import type UserDoc from "@/types/UserDoc";
import AGRequirements from "@/components/AGRequirements";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [agCounts, setAgCounts] = useState({
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
  });
  const gradeLevels = [9, 10, 11, 12];

  useEffect(() => {
    if (!authLoading && user) {
      getUserInformation(user.uid).then((data) => {
        setUserInfo(data);
        setLoading(false);
      });

      getAGCompleted(user.uid).then((counts) => {
        setAgCounts(counts);
      });

      const coursePlansRef = collection(db, "users", user.uid, "coursePlans");
      const unsubscribe = onSnapshot(coursePlansRef, () => {
        getAGCompleted(user.uid).then((counts) => {
          setAgCounts(counts);
        });
      });

      return () => unsubscribe();
    }
  }, [authLoading, user]);

  return (
    <div className="w-full flex flex-col pb-6">
      <h1 className="font-bold text-4xl ml-6 mb-6 mt-18">
        Welcome, {userInfo?.firstName ?? ""}!
      </h1>

      <div className="w-full flex flex-col gap-6 px-6">
        {!loading && user && userInfo ? (
          <>
            <AGRequirements agCounts={agCounts} />
            <div className="w-full flex items-start gap-6">
              {gradeLevels.map((gradeLevel) => (
                <CoursePlan
                  key={gradeLevel}
                  userId={user.uid}
                  gradeLevel={gradeLevel}
                  schoolId={userInfo.schoolId.toString()}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex gap-2 w-full justify-center items-center">
            <Spinner />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
