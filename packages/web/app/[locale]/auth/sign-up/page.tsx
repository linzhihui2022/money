"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Form, FormField, InlineFormItem } from "@/components/ui/form";
import { useToast } from "@/lib/use-toast";
import { signup } from "./action";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/use-nav";

export default function LoginPage() {
  const form = useForm<{ email: string; password: string; name: string }>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1).max(16),
        email: z.string().min(1),
        password: z.string().min(1).max(16),
      }),
    ),
    defaultValues: {
      name: "Lychee",
      email: "linzhihui2022+supabase@outlook.com",
      password: "Lin123456!",
    },
  });

  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("auth");

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Form {...form}>
        <form
          className="w-full max-w-md"
          onSubmit={form.handleSubmit(async (data) => {
            startTransition(async () => {
              await signup(data)
                .then(() => router.push("/"))
                .catch((e: Error) => {
                  toast({ title: e.message, variant: "destructive" });
                });
            });
          })}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {t("Sign up")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <InlineFormItem label={t("Name")}>
                      <Input {...field} />
                    </InlineFormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InlineFormItem label={t("Email")}>
                      <Input {...field} />
                    </InlineFormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <InlineFormItem label={t("Password")}>
                      <Input {...field} type="password" />
                    </InlineFormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="space-x-4">
              <Button asChild variant="outline">
                <Link href="/auth/sign-in">{t("Sign in")}</Link>
              </Button>
              <Button disabled={pending} className="w-full">
                {t("Sign up")}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
