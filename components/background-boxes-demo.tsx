"use client";
import React, { Children } from "react";
import { Boxes } from "@/components/ui/background-boxes";

export function BackgroundBoxes({ children }: { children?: React.ReactNode }) {
  return (
    <div className="h-screen z-50 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 mask-[radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      {children}
     
    </div>
  );
}


