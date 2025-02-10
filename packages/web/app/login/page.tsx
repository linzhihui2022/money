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
import { useOptimistic, useTransition } from "react";
import { ActionState, EmptyObj, initialState, successState } from "types";
import { Form, FormField, InlineFormItem } from "@/components/ui/form";
import { login } from "actions/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/use-toast";

export default function LoginPage() {
  const form = useForm<{ username: string; password: string }>({
    resolver: zodResolver(
      z.object({ username: z.string().min(1), password: z.string().min(1) }),
    ),
    defaultValues: { username: "aws_test_2", password: "Lin123456!" },
  });
  const [state, setState] = useOptimistic<ActionState<EmptyObj>>(
    initialState({}),
  );
  const [, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Form {...form}>
        <form
          className="w-full max-w-xs"
          onSubmit={form.handleSubmit(async (data) => {
            startTransition(async () => {
              setState(successState({}));
              const res = await login(state, data);
              switch (res.status) {
                case "success":
                  router.push("/");
                  break;
                case "error":
                  toast({ title: res.error?.message, variant: "destructive" });
                  break;
              }
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
                  name="username"
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
            </CardContent>
            <CardFooter>
              <Button className="w-full">Sign in</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
