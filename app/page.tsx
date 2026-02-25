import { BackgroundBoxes } from "@/components/background-boxes-demo";
import PlaceholdersAndVanishInputBox from "@/components/placeholders-and-vanish-input-demo";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between">
      <BackgroundBoxes>
         <div className="flex text-white justify-center items-center">
        <Image
          src="/groklogo.png"
          alt="Tailwind CSS Logo"
          width={200}
          height={70}
          className="relative z-50"
        />
      </div>

      <PlaceholdersAndVanishInputBox />
      
      <p className="text-center text-xs mt-2 tracking-wide font-mono text-neutral-300 relative z-20">
        Test Grok API Keys and System prompts
      </p>
      </BackgroundBoxes>
    </main>
  );
}
