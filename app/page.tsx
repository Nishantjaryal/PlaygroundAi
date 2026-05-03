"use client";
import { signIn } from "@/auth";
import { auth } from "@/auth";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { BackgroundBoxes } from "@/components/background-boxes-demo";
import { Button } from "@/components/ui/button";
import {
  Card,
  
} from "@/components/ui/card";



export default async function Home() {
  const session = await auth();

  const router = useRouter(); 
  const [isSubmitting, setIsSubmitting] = useState(false);



  


  const handleSubmit = async () => {
   

    setIsSubmitting(true);

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
          <Button className={`${(!session?.user) ? 'w-[80%]' : 'hidden'}`} disabled={isSubmitting} onClick={()=>handleSubmit()}>
            {isSubmitting ? "Creating... " : "Launch Playground"}
          </Button>

          <form
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: "/playground",
        });
      }}
    >
      <button type="submit">
        Login with Google
      </button>
    </form>
        </Card>
      </BackgroundBoxes>
    </main>
  );
}
