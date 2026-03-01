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

interface ModelOption {
  name: string;
  service: string;
}

function Get_First_Name(modelName: string) {
  const parts = modelName.split("-");
  return parts.length > 0 ? parts[0] : modelName;
}

export default function TestPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [serviceModel, setserviceModel] = useState<ModelOption>({name: "llama-3.3-70b-versatile",service:"groq"}); 
  const [System_Prompt, setSystemPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi! I am Your Ai Agent, How can I assist You`,
    },
  ]);
  
 
  const availableModels = [
    // Groq models
    { value: {name: "llama-3.3-70b-versatile",service:"groq"}, label: "LLaMA 3.3 70B Versatile (Groq)" },
    { value: {name: "llama-3.1-8b-instant",service:"groq"}, label: "LLaMA 3.1 8B Instant (Groq)" },
    { value: {name: "llama-4-scout-17b-16e-instruct",service:"groq"}, label: "LLaMA 4 Scout 17B (Groq)" },
    // Ollama cloud models
    { value: {name: "gpt-oss:120b",service:"ollama"}, label: "GPT-OSS 120B (Ollama)" },
    { value: {name: "deepseek-v3.2",service:"ollama"}, label: "DeepSeek V3.2 (Ollama)" },
    { value: {name: "qwen3-coder-next",service:"ollama"}, label: "Qwen3 Coder Next (Ollama)" },
    { value: {name: "qwen3.5:27b",service:"ollama"}, label: "Qwen 3.5 27B (Ollama)" },
    { value: {name: "qwen3.5:122b",service:"ollama"}, label: "Qwen 3.5 122B (Ollama)" },
    { value: {name: "devstral-small-2:24b",service:"ollama"}, label: "Devstral Small 2 24B (Ollama)" },
    { value: {name: "gemini-3-flash-preview",service:"ollama"}, label: "Gemini 3 Flash Preview (Ollama)" },
    { value: {name: "glm-5",service:"ollama"}, label: "GLM-5 (Ollama)" },
    { value: {name: "kimi-k2.5",service:"ollama"}, label: "Kimi K2.5 (Ollama)" },
  ];

  // Auto-scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/${serviceModel.service}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          model_name: serviceModel.name,
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
                AI Test Environment <Bot className="w-8 h-8" />
              </h1>{" "}
            </CardTitle>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              A playground to test AI system prompts, and model
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
            value={serviceModel.name ? JSON.stringify(serviceModel) : ""}
            onChange={(e) => setserviceModel({  name: JSON.parse(e.target.value).name, service: JSON.parse(e.target.value).service })}
            className="w-full rounded-md border border-slate-200 dark:border-white/30 bg-white dark:bg-transparent text-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-white/40 transition-shadow appearance-none cursor-pointer"
          >
            {availableModels.map((m) => (
              <option key={m.value.name} value={JSON.stringify(m.value)} className="bg-white dark:bg-slate-900">
                {m.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Selected: <span className="font-mono">{serviceModel.name}</span>
          </p>
        </div>

        
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
