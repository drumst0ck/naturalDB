import { NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
import getDBSchema from '../../../lib/getDBSchema';
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);


const dbConfig = {
    user: "drumstock",
    host: "157.90.123.33",
    database: "postgres",
    password: "Gestion_2020",
    port: parseInt("10912"),
};

export async function POST(req) {
    try {
        const { prompt } = await req.json();

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

        This will allow for easy substitution of these variables later. Do not use quotes around these variables unless specifically required by the SQL syntax.`;

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: "Cual es el usuario con mas mensajes" }
            ]
        });
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Error in SQL generation:', error);
        return NextResponse.json({ error: 'An error occurred while generating SQL.' }, { status: 500 });
    }
}