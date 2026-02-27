import { Ollama } from "ollama";
import { NextRequest, NextResponse } from "next/server";

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { message, model_name, system_prompt } = await req.json();

    const SYSTEM_PROMPT =
      system_prompt ||
      "You are a very helpful, kind and intelligent ai agent, help users with their queries"; // Use the provided system prompt or default to a generic one

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "A valid message string is required." },
        { status: 400 },
      );
    }

    const response = await ollama.chat({
      model: model_name ,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      stream: true,
    });

    let reply = "";
    for await (const part of response) {
      reply += part.message.content;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[chat/route] Ollama API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to get a response: ${errorMessage}` },
      { status: 500 },
    );
  }
}
