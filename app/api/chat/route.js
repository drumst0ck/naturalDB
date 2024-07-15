import { NextResponse } from "next/server";
import { StreamingTextResponse, streamText } from "ai";
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
                          IMPORTANT:

                          For SELECT queries:

                          Use variables in the format $variablename (without curly braces) for conditions in WHERE clauses.
                          Example: WHERE column_name = $value


                          For INSERT, UPDATE, and other data modification queries:

                          Use actual values or placeholders as appropriate for the database system.
                          For string values, use single quotes: 'example'
                          For numeric values, do not use quotes: 42
                          For date/time values, use the appropriate format: '2023-07-15'


                          General guidelines:

                          Use $tablename for table names when the table name is variable
                          Use $columnname for column names when the column name is variable
                          Do not use variables for actual data values in INSERT or UPDATE statements


                          You should always answer in the language you are asked to speak.

                          CRITICAL: Always limit the number of results returned by SELECT queries to a maximum of 20 entries. Use the appropriate SQL syntax (such as LIMIT 20 for most databases) to enforce this restriction. This applies to all SELECT queries, including those used in subqueries or as part of more complex operations.
                          Remember to apply this limit even when not explicitly requested in the natural language input. The goal is to prevent the execution of queries that could return an excessive number of results and potentially overload the server.
                          Examples:

                          SELECT query:
                          SELECT * FROM users WHERE age > $age LIMIT 20;
                          INSERT query:
                          INSERT INTO users (name, age, email) VALUES ('John Doe', 30, 'john@example.com');
                          UPDATE query:
                          UPDATE products SET price = 19.99 WHERE id = $product_id;

                          Generate the SQL query based on the user's request, following these guidelines.`;

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
