import "@/app/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>

        <Toaster closeButton />
      </body>
    </html>
  );
}
