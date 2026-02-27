"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { redirect } from "next/navigation";


// unused component to test the vanish input and placeholders, not used in the app currently

export default function PlaceholdersAndVanishInputBox() {
  const placeholders = [
    "Enter your Groq API key",
    "Run To configure Ai Environment"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    redirect("/playground");

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
