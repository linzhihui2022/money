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
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Form {...form}>
        <form
          className="w-full max-w-xs"
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
              <CardTitle className="text-2xl">Sign up</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <InlineFormItem label="Name">
                      <Input {...field} />
                    </InlineFormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InlineFormItem label="Email">
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
            </CardContent>
            <CardFooter>
              <Button disabled={pending} className="w-full">
                Sign up
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
