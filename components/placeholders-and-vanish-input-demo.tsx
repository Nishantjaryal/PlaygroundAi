"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { redirect } from "next/navigation";

export default function PlaceholdersAndVanishInputBox() {
  const placeholders = [
    "Enter your Grok API key",
    "Run To configure Ai Environment"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("grok-api-key", e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    redirect("/test");

  };
  return (
    <div className=" flex flex-col justify-center items-center px-4">
     
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
