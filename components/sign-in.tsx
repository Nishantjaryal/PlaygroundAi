"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";
import Image from "next/image";

type SignInProps = {
  isSubmitting?: boolean;
  session: Session | null;
};

export default function SignIn({ isSubmitting, session }: SignInProps) {
  const router = useRouter();

  const launch = () => router.push("/playground");

  return (
    <div className="flex flex-col gap-4">
      {session?.user ? (
        <>
          <h1 className="w-full text-center">Welcome {session.user.name}</h1>

          <Button disabled={isSubmitting} onClick={launch}>
            Launch Playground 🚀
          </Button>
        </>
      ) : (
        <Button className="flex items-center justify-evenly" onClick={() => signIn("google")}>
          <Image src="/google.png" alt="Google Logo" width={20} height={20} />
          <p>Sign in with Google</p>
        </Button>
      )}
    </div>
  );
}
