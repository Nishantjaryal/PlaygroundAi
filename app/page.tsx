"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { BackgroundBoxes } from "@/components/background-boxes-demo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type AuthMode = "signin" | "signup";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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


  const handleSubmit = async () => {
   

    setIsSubmitting(true);
    setError("");

    // Simulate a successful auth request before redirecting to the playground.
    await new Promise((resolve) => setTimeout(resolve, 650));
    router.push("/playground");
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between">
      <BackgroundBoxes>
        <div className="relative z-10  flex flex-col items-center gap-2 mb-6 px-4 text-center text-white">
          <Image
            src="/playgroundAI.png"
            alt="Ai Playground"
            width={250}
            height={70}
            className="drop-shadow-lg"
            priority
          />
          <p className="text-xs font-mono tracking-wide text-neutral-200">
            Test Groq and Ollama Models on User parameters and System prompts
          </p>
        </div>

        <Card className="relative z-10 w-full flex justify-center items-center max-w-md border-white/10 bg-white/10 px-1 backdrop-blur-sm shadow-xl text-white">
          <Button className="w-[80%]" disabled={isSubmitting} onClick={()=>handleSubmit()}>
            {isSubmitting ? "Creating... " : "Launch Playground"}
          </Button>

          {/* <p className="text-center text-xs text-neutral-200">
Built a testing framework to evaluate responses from Groq and Ollama models against custom user parameters and system prompts.
Analyzed model behavior, prompt sensitivity, and output quality to compare performance across different configurations.
Designed to support prompt engineering experiments and optimize LLM response reliability.            </p> */}
        </Card>
      </BackgroundBoxes>
    </main>
  );
}
