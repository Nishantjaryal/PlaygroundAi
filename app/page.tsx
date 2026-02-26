import { BackgroundBoxes } from "@/components/background-boxes-demo";
import PlaceholdersAndVanishInputBox from "@/components/placeholders-and-vanish-input-demo";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between">
      <BackgroundBoxes>
         <div className="flex text-white justify-center items-center">
        <Image
          src="/groqPlay.png"
          alt="Tailwind CSS Logo"
          width={250}
          height={70}
          className="relative z-50"
        />
      </div>

      <PlaceholdersAndVanishInputBox />
      
      <p className="text-center text-xs mt-2 tracking-wide font-mono text-neutral-300 relative z-20">
        Test Groq API Keys and System prompts
      </p>

      <p className="text-xs mt-1 font-mono text-white/70 z-50">
        Did'nt have a key? Generate a new key from <Link className="font-bold underline underline-offset-2" href={"https://console.groq.com/keys"}>API Console</Link>
      </p>
      </BackgroundBoxes>
    </main>
  );
}
