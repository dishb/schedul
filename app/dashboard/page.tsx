"use client";

import CoursePlan from "@/components/CoursePlan";
import useAuth from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const { user, loading: authLoading } = useAuth();

  return (
    <div className="w-full h-screen items-center justify-center flex flex-col">
      <div className="w-full flex justify-evenly">
        {!authLoading ? (
          <CoursePlan userId={user.uid} schoolId="2754" gradeLevel={9} />
        ) : (
          <div className="flex gap-2">
            <Spinner /> <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
