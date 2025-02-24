"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const t = useTranslations("sr-only");
  return (
    <Button
      onClick={() => setTheme((v) => (v === "light" ? "dark" : "light"))}
      variant="ghost"
      size="icon"
    >
      <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t("Toggle Theme")}</span>
    </Button>
  );
}
