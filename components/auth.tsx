"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type AuthMode = "signin" | "signup";

const Auth = () => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const title = useMemo(
    () => (mode === "signin" ? "Sign in to continue" : "Create your account"),
    [mode],
  );

  const subtitle = useMemo(
    () =>
      mode === "signin"
        ? "Use the email you registered with to access the playground."
        : "Sign up to start testing Groq prompts in the playground.",
    [mode],
  );

  const handleChange =
    (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      setError("");
    };

  const handleConnectionCheck = async () => {
    setConnectionStatus(null);
    setIsCheckingConnection(true);

    try {
      const response = await fetch("/api/supabase-health", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as { ok: boolean; message: string };

      setConnectionStatus({
        ok: response.ok && data.ok,
        message: data.message,
      });
    } catch {
      setConnectionStatus({
        ok: false,
        message: "Supabase Auth service is unreachable",
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  useEffect(() => {
    handleConnectionCheck();
  }, []);

  const validate = () => {
    if (!form.email.trim() || !form.password.trim()) {
      return "Email and password are required.";
    }
    if (!form.email.includes("@")) {
      return "Please enter a valid email address.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (mode === "signup" && form.password !== form.confirm) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);
    const client = supabase();

    try {
      if (mode === "signup") {
        const { data, error } = await client.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        if (!data.session) {
          setError(
            "Signup successful. Check your email to confirm your account.",
          );
          return;
        }
      } else {
        const { error } = await client.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) {
          setError(error.message);
          return;
        }
      }

      router.push("/playground");
    } catch (err: unknown) {
      const message =
        err instanceof Error &&
        err.message.toLowerCase().includes("failed to fetch")
          ? "Unable to reach Supabase. Check your internet, Supabase project status, and .env.local values, then restart dev server."
          : "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="relative z-10 w-full max-w-md border-white/10 bg-white/10 px-1 backdrop-blur-sm shadow-xl text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/10 p-1 text-xs font-medium uppercase tracking-tight">
            <Button
              type="button"
              size="sm"
              variant={mode === "signin" ? "default" : "ghost"}
              className="rounded-full px-3"
              onClick={() => setMode("signin")}
              disabled={isSubmitting}
            >
              Sign in
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "signup" ? "default" : "ghost"}
              className="rounded-full px-3"
              onClick={() => setMode("signup")}
              disabled={isSubmitting}
            >
              Sign up
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-xl text-white">{title}</CardTitle>
          <CardDescription className="text-neutral-200">
            {subtitle}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Email</label>
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              className="bg-white/10 text-white placeholder:text-neutral-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Password</label>
            <Input
              type="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
              className="bg-white/10 text-white placeholder:text-neutral-300"
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Confirm password
              </label>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange("confirm")}
                className="bg-white/10 text-white placeholder:text-neutral-300"
              />
            </div>
          )}

          {error && (
            <p className="rounded-md border border-red-200/60 bg-red-50/70 px-3 py-2 text-sm font-medium text-red-900">
              {error}
            </p>
          )}

          <div className="flex items-center gap-2">
            
            <span
              className={`w-4 h-4 ${connectionStatus?.ok ? "bg-emerald-500" : "bg-red-500"} ${isCheckingConnection ? "animate-pulse" : ""} `}
            ></span>
            <span className="text-sm text-neutral-300">
              {isCheckingConnection ? "Checking Supabase connection..."
                : connectionStatus?.ok
                ? "Auth service is Live"
                : connectionStatus?.message || "Supabase Auth service is unreachable"}
            </span>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
              : mode === "signin"
                ? "Sign in"
                : "Sign up"}
          </Button>
        </form>

        <p className="text-center text-xs text-neutral-200">
          This is a demo flow. On success you will be redirected to the{" "}
          <Link
            href={"/playground"}
            className="underline underline-offset-4 text-white"
          >
            playground
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
};

export default Auth;
