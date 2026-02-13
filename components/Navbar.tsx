"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Navbar() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="flex justify-end px-6 py-4">
      <Button
        onClick={async () => {
          await logout();
          router.push("/login")
          toast.success("Successfully logged out!")
        }}
      >
        <LogOut /> Logout
      </Button>
    </nav>
  );
}
