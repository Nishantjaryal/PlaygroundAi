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
    const {
      message,
      model_name,
      system_prompt,
      sys_temperature = 0.7, // default
    } = await req.json();

    const SYSTEM_PROMPT =
      system_prompt ||
      "You are a very helpful, kind and intelligent ai agent.";

    const response = await ollama.chat({
      model: model_name,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      stream: true,

      options: {
          temperature: sys_temperature,
      },
    });

    let reply = "";
    for await (const part of response) {
      reply += part.message.content;
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}