import { NextResponse } from "next/server";
import { StreamingTextResponse, streamText, convertToCoreMessages } from "ai";
import getDBSchema from "../../../lib/getDBSchema";
import { createOpenAI } from "@ai-sdk/openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, dbConfig, openaiApiKey } = body;

    if (!dbConfig || !messages || messages.length === 0 || !openaiApiKey) {
      console.error("Missing dbConfig, messages, or OpenAI API key");
      return NextResponse.json(
        {
          error: "Missing database configuration, messages, or OpenAI API key.",
        },
        { status: 400 }
      );
    }

    const openai = createOpenAI({
      apiKey: openaiApiKey,
      compatibility: "strict",
    });

    const prompt = messages[messages.length - 1].content;
    const dbSchema = await getDBSchema(dbConfig);
    const systemMessage = `You are an AI assistant specialized in generating SQL queries for PostgreSQL based on natural language requests.
        Use the following database schema to generate accurate SQL queries:
        ${dbSchema}

        Generate only the SQL query without any additional explanation or numbering. Ensure the query is compatible with the provided schema and PostgreSQL syntax.

        IMPORTANT:
        For all queries:
        - Use PostgreSQL-specific syntax and data types.
        - Perform a final syntax check before providing the response.
        - If multiple queries are needed, separate them with a semicolon (;) but do not number them.

        For SELECT queries:
        - Use variables in the format $variableName (without braces) for conditions in WHERE clauses.
        Example: WHERE column_name = $value
        - Always limit results to a maximum of 20 entries using LIMIT 20.

        For INSERT, UPDATE, and other data modification queries:
        - Use actual values or appropriate placeholders for PostgreSQL.
        - For string values, use single quotes: 'example'
        - For numeric values, do not use quotes: 42
        - For date/time values, use the appropriate format: '2023-07-15'

        For CREATE TABLE statements:
        - Use appropriate PostgreSQL data types (e.g., SERIAL for auto-incrementing integers)
        - Correctly format TIMESTAMP WITH TIME ZONE as a single type
        - Ensure all column constraints (e.g., NOT NULL) are correctly specified
        - Double-check that there are no duplicate or conflicting constraints

        General guidelines:
        - Use $tableName for table names when the table name is variable
        - Use $columnName for column names when the column name is variable
        - Do not use variables for actual data values in INSERT or UPDATE statements

        Generate the SQL query based on the user's request, following these guidelines and performing a final syntax verification before providing the answer. Remember, do not number the queries if multiple are provided; simply separate them with semicolons.`;

    const model = openai.chat("gpt-4o");
    const result = await streamText({
      model: model,
      messages: convertToCoreMessages([
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ]),
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
