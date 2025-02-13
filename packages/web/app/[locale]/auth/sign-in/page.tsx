import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { singIn } from "./action";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("auth");
  const msg = await errorMsg(error_code);
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <form
        className="w-full max-w-sm"
        onSubmit={async () => {
          "use server";
          await singIn();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("Sign in")}</CardTitle>
            {msg ? (
              <CardDescription className="text-destructive">
                {msg}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>
            <Button className="w-full">{t("Sign in")}</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
