"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";

type SignInProps = {
  isSubmitting?: boolean;
  session: Session | null;
};

export default function SignIn({
  isSubmitting,
  session,
}: SignInProps) {
  const router = useRouter();

  const launch = () => router.push("/playground");

  return (
    <div className="flex flex-col gap-4">
      {session?.user ? (
        <>
          <h1>Welcome {session.user.name}</h1>

          <Button
            disabled={isSubmitting}
            onClick={launch}
          >
            Launch Playground
          </Button>
        </>
      ) : (
        <Button onClick={() => signIn("google")}>
          Login with Google
        </Button>
      )}
    </div>
  );
}