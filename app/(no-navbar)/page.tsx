import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="font-bold text-3xl">Schedul</h1>
      <p className="mt-10">Choose an option below to get started.</p>
      <div className="grid grid-cols-2 mt-4 gap-4">
        <Button asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
