import Image from "next/image";

import { BackgroundBoxes } from "@/components/background-boxes-demo";
import { Card } from "@/components/ui/card";
import SignIn from "@/components/sign-in";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between">
      <BackgroundBoxes>
        <div className="relative z-10 flex flex-col items-center gap-2 mb-6 px-4 text-center text-white">
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
          <SignIn  session={session} />
        </Card>
      </BackgroundBoxes>
    </main>
  );
}