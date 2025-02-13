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
import { singIn } from "./action";
import { useToast } from "@/lib/use-toast";
import { Link } from "@/lib/use-nav";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const form = useForm<{ email: string; password: string }>({
    resolver: zodResolver(
      z.object({ email: z.string().min(1), password: z.string().min(1) }),
    ),
    defaultValues: {
      email: "linzhihui2022+supabase@outlook.com",
      password: "Lin123456!",
    },
  });
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Form {...form}>
        <form
          className="w-full max-w-xs"
          onSubmit={form.handleSubmit(async (data) => {
            startTransition(async () => {
              await singIn(data)
                .then(() => router.push("/"))
                .catch((e: Error) => {
                  toast({ title: e.message, variant: "destructive" });
                });
            });
          })}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InlineFormItem label="Username">
                      <Input {...field} />
                    </InlineFormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <InlineFormItem label="Password">
                      <Input {...field} type="password" />
                    </InlineFormItem>
                  )}
                />
              </div>
              <Button asChild variant="link">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </CardContent>
            <CardFooter>
              <Button disabled={pending} className="w-full">
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
