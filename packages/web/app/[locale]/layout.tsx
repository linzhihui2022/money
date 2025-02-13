import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PendingProvider } from "@/lib/use-nav";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "layout" });
  return {
    title: t("title"),
    description: t("description"),
  };
}
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="flex min-h-screen w-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <PendingProvider>
            {children}
            <Toaster />
          </PendingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
