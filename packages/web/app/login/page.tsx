"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "react-use";

export default function LoginPage() {
  const router = useRouter();
  const [, setRefreshToken] = useLocalStorage<string>("refreshToken", "", {
    raw: true,
  });
  const [, setExpiresAt] = useLocalStorage<string>("expiresAt", "", {
    raw: true,
  });
  const [, setToken] = useLocalStorage<string>("token", "", {
    raw: true,
  });
  const [, setUsername] = useLocalStorage<string>("username", "", {
    raw: true,
  });
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <form
        className="w-full max-w-xs"
        action={async (form: FormData) => {
          const { username, password } = z
            .object({ username: z.string(), password: z.string() })
            .parse({
              username: form.get("username"),
              password: form.get("password"),
            });
          const data = await api<{
            token: string;
            refreshToken?: string;
            expiresIn: number;
          }>({
            uri: `/user`,
            method: "POST",
            body: { username, password },
          });
          const { token, refreshToken, expiresIn } = data;
          const expiresAt = new Date().getTime() + expiresIn * 1000;
          if (refreshToken) {
            setRefreshToken(refreshToken);
            setExpiresAt(`${expiresAt}`);
            setToken(token);
            setUsername(username);
            router.push("/");
          }
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                defaultValue="aws_test_2"
              />
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                defaultValue="Welcome321!"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Sign in</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
