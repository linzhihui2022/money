import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Money",
  description: "Money,Money,Money",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
