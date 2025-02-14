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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LocaleToggle } from "@/components/locale-toggle";

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
      <div className="fixed left-5 bottom-5 z-10">
        <LocaleToggle />
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
          <CardContent>
            <RadioGroup defaultValue="github" name="provider">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="github" id="r1" />
                <Label htmlFor="r1">Github</Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button className="w-full">{t("auth.Sign in")}</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
