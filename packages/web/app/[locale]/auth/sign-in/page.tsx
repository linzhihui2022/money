import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { singIn } from "./action";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { LocaleToggle } from "@/components/locale-toggle";
import { ModeToggle } from "@/components/theme-toggle";

const errorMsg = async (code: string) => {
  const t = await getTranslations("auth");
  if (!code) return "";
  switch (code) {
    case "signup_disabled": {
      return t("signup_disabled");
    }
    default: {
      return t("error");
    }
  }
};
export default async function LoginPage(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { error_code } = await props.searchParams;
  const t = await getTranslations();
  const msg = await errorMsg(error_code);
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <div className="fixed left-5 bottom-5 z-10 flex items-center gap-2">
        <LocaleToggle />
        <ModeToggle />
      </div>
      <form
        className="w-full max-w-sm"
        action={async (formData) => {
          "use server";
          await singIn(formData);
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("hello")}</CardTitle>
            {msg ? (
              <CardDescription className="text-destructive">
                {msg}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter>
            <Button className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
                ></path>
              </svg>
              {t("auth.Sign in")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
