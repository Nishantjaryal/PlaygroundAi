"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function TestPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I am Groq, How can I assist You",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // const [api, setKey] = useState<string>("");
  const [groqModel, setgroqModel] = useState<string>("llama-3.3-70b-versatile");
  const [System_Prompt, setSystemPrompt] = useState<string>("");

  const availableModels = [
    { value: "llama-3.3-70b-versatile", label: "LLaMA 3.3 70B Versatile" },
    { value: "llama-3.1-8b-instant", label: "LLaMA 3.1 8B Instant" },
    { value: "meta-llama/llama-4-scout-17b-16e-instruct", label: "LLaMA 4 Scout 17B" },
  ];

  // Auto-scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // useEffect(() => {
  //   setKey(process.env.GROQ_API_KEY || "");
  // }, []);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          // apiKey: api,
          model_name: groqModel,
          system_prompt: System_Prompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ?? "I couldn't find an answer, but I'm here to help!",
        },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, something went wrong: ${msg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex gap-4 bg-white text-slate-900 dark:bg-black dark:text-white p-4">
      <div className="flex flex-col justify-start items-start gap-4 w-full">
        <Card className="w-full h-full dark:bg-black backdrop-blur ">
          <CardHeader>
            <CardTitle className="text-xl">
              <h1 className=" flex gap-2 text-3xl font-semibold mb-1 tracking-tight">
                Groq Test Environment <Bot className="w-8 h-8" />
              </h1>{" "}
            </CardTitle>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              A playground to test groq API keys, system prompts, and model
            </p>
          </CardHeader>
          <CardContent  >
            <div
              ref={scrollRef}
              className="h-full overflow-y-auto rounded-md p-4 dark:bg-black-600"
            >
              <div className="space-y-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={
                      m.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        "max-w-[80%] rounded-lg border px-3 py-2 text-sm whitespace-pre-wrap " +
                        (m.role === "user"
                          ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white"
                          : "bg-slate-100 text-slate-900 border-slate-200 dark:bg-transparent dark:text-white dark:border-white/50")
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-white/50 dark:text-white/80 animate-pulse">
                      Agent is thinking...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="min-w-72 flex flex-col gap-3">
        {/* Agent / Model Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Agent / Model
          </label>
          <select
            value={groqModel}
            onChange={(e) => setgroqModel(e.target.value)}
            className="w-full rounded-md border border-slate-200 dark:border-white/30 bg-white dark:bg-transparent text-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-white/40 transition-shadow appearance-none cursor-pointer"
          >
            {availableModels.map((m) => (
              <option key={m.value} value={m.value} className="bg-white dark:bg-slate-900">
                {m.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Selected: <span className="font-mono">{groqModel}</span>
          </p>
        </div>

        {/* API Key */}
        {/* <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            API Key
          </label>
          <input
            type="password"
            value={api}
            onChange={(e) => {
              setKey(process.env.GROQ_API_KEY);
            }}
            placeholder="gsk_..."
            className="w-full rounded-md border border-slate-200 dark:border-white/30 bg-white dark:bg-transparent text-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-white/40 transition-shadow"
          />
        </div> */}

        {/* Chat Form */}
        <form onSubmit={handleSend} className="flex flex-col gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="dark:border-white/30 min-h-30 dark:bg-transparent dark:text-white"
          />
          <Textarea
            value={System_Prompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="System prompt"
            className="dark:border-white/30 min-h-24 dark:bg-transparent dark:text-white"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </div>
     
    </div>
  );
}
