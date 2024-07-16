import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const openai = createOpenAI({
      apiKey: apiKey,
      compatibility: "strict",
    });

    const model = openai.chat("gpt-3.5-turbo");
    const texto = await generateText({
      model: model,
      prompt: "Validating API key...",
    });

    return NextResponse.json({ message: "Valid API key" }, { status: 200 });
  } catch (error) {
    console.error("Error validating API key:", error);
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }
}
