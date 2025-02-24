"use client";
import { useLocale } from "next-intl";
import { locales } from "i18n/locales";
import { Fragment, useTransition } from "react";
import { Separator } from "./ui/separator";
import { Button } from "@/components/ui/button";
import { setUserLocale } from "../i18n/cookies";

export const LocaleToggle = () => {
  const currentLocale = useLocale();

  const [, startTransition] = useTransition();
  function onChange(value: (typeof locales)[number]) {
    startTransition(() => {
      setUserLocale(value);
    });
  }

  return (
    <div className="flex p-2">
      {locales.map((locale) => (
        <Fragment key={locale}>
          <Button
            variant={currentLocale === locale ? "secondary" : "ghost"}
            disabled={currentLocale === locale}
            size="sm"
            className="uppercase"
            onClick={() => {
              onChange(locale);
            }}
          >
            {locale}
          </Button>
          <Separator orientation="vertical" className="mx-2 last:hidden" />
        </Fragment>
      ))}
    </div>
  );
};
