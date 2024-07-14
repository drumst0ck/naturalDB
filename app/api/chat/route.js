import { NextResponse } from "next/server";
import {
  StreamingTextResponse,
  streamText,
} from "ai";
import getDBSchema from "../../../lib/getDBSchema";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, dbConfig } = body;
    if (!dbConfig || !messages || messages.length === 0) {
      console.error("Missing dbConfig or messages");
      return NextResponse.json(
        { error: "Missing database configuration or messages." },
        { status: 400 }
      );
    }

    const prompt = messages[messages.length - 1].content;
    const dbSchema = await getDBSchema(dbConfig);
    const systemMessage = `You are an AI assistant that generates SQL queries based on natural language requests. 
                          Use the following database schema to generate accurate SQL queries:

                          ${dbSchema}

                          Generate only the SQL query without any additional explanation. Ensure the query is compatible with the provided schema.

                          IMPORTANT: Instead of using specific values, use variables in the format $variablename (without curly braces). For example:
                          - Use $host instead of a specific host name
                          - Use $port instead of a specific port number
                          - Use $dbname instead of a specific database name
                          - Use $tablename for table names when appropriate
                          - Use $columnname for column names when appropriate
                          - Use $value for any other specific values that might need to be substituted
                          - You should always answer in the language you are asked to speak.

                          This will allow for easy substitution of these variables later. Do not use quotes around these variables unless specifically required by the SQL syntax.

                          CRITICAL: Always limit the number of results returned by the query to a maximum of 20 entries. Use the appropriate SQL syntax (such as LIMIT 20 for most databases) to enforce this restriction. This applies to all SELECT queries, including those used in subqueries or as part of more complex operations.

                          Remember to apply this limit even when not explicitly requested in the natural language input. The goal is to prevent the execution of queries that could return an excessive number of results and potentially overload the server.`;

    const model = openai.chat("gpt-3.5-turbo");
    const result = await streamText({
      model: model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
    });
    return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error("Error in SQL generation:", error);
    return NextResponse.json(
      {
        error: "An error occurred while generating SQL.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
