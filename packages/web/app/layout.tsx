import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PendingProvider } from "@/lib/use-nav";
import { QueryProvider } from "@/lib/use-api";

export const metadata = {
  title: "Money",
  description: "Money,Money,Money",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">
        <QueryProvider>
          <PendingProvider>
            {children}
            <Toaster />
          </PendingProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
