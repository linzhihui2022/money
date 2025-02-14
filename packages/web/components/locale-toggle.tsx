"use client";
import { useLocale } from "next-intl";
import { locales } from "i18n/locales";
import { Link, usePathname } from "i18n/routing";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { Separator } from "./ui/separator";

export const LocaleToggle = () => {
  const currentLocale = useLocale();
  const currentPath = usePathname();
  return (
    <div className="flex p-2">
      {locales.map((locale) => (
        <Fragment key={locale}>
          <Link
            className={cn("uppercase text-xs text-primary/80", {
              "text-primary font-bold": currentLocale === locale,
            })}
            locale={locale}
            href={`/${currentPath}`}
          >
            {locale}
          </Link>
          <Separator orientation="vertical" className="mx-2 last:hidden" />
        </Fragment>
      ))}
    </div>
  );
};
