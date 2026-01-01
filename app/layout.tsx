import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "The premier biology competition for high schoolers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}
