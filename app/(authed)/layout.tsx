"use client";

import Navbar from "@/components/Navbar";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="w-full flex flex-col gap-4">
        <Navbar />
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
