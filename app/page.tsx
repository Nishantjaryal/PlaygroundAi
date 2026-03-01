"use client";

import Image from "next/image";

import { BackgroundBoxes } from "@/components/background-boxes-demo";
import Auth from "@/components/auth";

export default function Home() {
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
        <Auth/>
      </BackgroundBoxes>
    </main>
  );
}
