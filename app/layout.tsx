import { Host_Grotesk } from "next/font/google";
import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "The premier biology competition for high schoolers.",
};

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
  fallback: ["system-ui"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hostGrotesk.className} antialiased min-h-screen`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
