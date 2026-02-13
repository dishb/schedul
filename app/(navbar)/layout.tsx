import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
