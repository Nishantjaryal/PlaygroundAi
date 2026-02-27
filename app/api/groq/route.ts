import { Groq } from "groq-sdk"
import { NextRequest, NextResponse } from "next/server"


const getGroqClient = (apiKey:string) => {
  const key = apiKey
  if (!key) throw new Error("Missing Groq API key")
  return new Groq({ apiKey: key })
}

export async function POST(req: NextRequest) {
  try {
    const { message, model_name, system_prompt } = await req.json()

    const SYSTEM_PROMPT = system_prompt || "You are a very helpful, kind and intelligent ai agent, help users with their queries"; // Use the provided system prompt or default to a generic one

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "A valid message string is required." },
        { status: 400 }
      )
    }

    const groq = getGroqClient(process.env.GROQ_API_KEY || "")

    const completion = await groq.chat.completions.create({
      model: model_name ,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })

    const reply = completion.choices[0]?.message?.content ?? ""

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("[chat/route] Groq API error:", error)

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      { error: `Failed to get a response: ${errorMessage}` },
      { status: 500 }
    )
  }
}
