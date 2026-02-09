"use client";

import CoursePlan from "@/components/CoursePlan";
import useAuth from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const gradeLevels = [9, 10, 11, 12];

  return (
    <div className="w-full py-6 flex flex-col">
      <div className="w-full flex items-start gap-4 px-8">
        {!authLoading && user ? (
          gradeLevels.map((gradeLevel) => (
            <CoursePlan
              key={gradeLevel}
              userId={user.uid}
              gradeLevel={gradeLevel}
              schoolId="2754"
            />
          ))
        ) : (
          <div className="flex gap-2">
            <Spinner /> <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
