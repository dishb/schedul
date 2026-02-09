"use client";

import { useEffect, useState } from "react";
import CoursePlan from "@/components/CoursePlan";
import useAuth from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { getUserInformation } from "@/lib/actions";
import type UserDoc from "@/types/UserDoc";

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const gradeLevels = [9, 10, 11, 12];

  useEffect(() => {
    if (!authLoading && user) {
      getUserInformation(user.uid).then((data) => {
        setUserInfo(data);
        setLoading(false);
      });
    }
  }, [authLoading, user]);

  return (
    <div className="w-full flex flex-col pb-10">
      <h1 className="font-bold text-4xl ml-10 my-10">
        Welcome, {userInfo?.firstName ?? "user"}!
      </h1>

      <div className="w-full flex items-start gap-4 px-8">
        {!loading && user && userInfo ? (
          gradeLevels.map((gradeLevel) => (
            <CoursePlan
              key={gradeLevel}
              userId={user.uid}
              gradeLevel={gradeLevel}
              schoolId={userInfo.schoolId.toString()}
            />
          ))
        ) : (
          <div className="flex gap-2">
            <Spinner />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
