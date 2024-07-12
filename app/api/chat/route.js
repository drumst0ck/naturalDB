import { NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
import getDBSchema from '../../../lib/getDBSchema';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

export async function POST(req) {
    try {
        const body = await req.json();
        const { messages, dbConfig } = body;
        if (!dbConfig || !messages || messages.length === 0) {
            console.error("Missing dbConfig or messages");
            return NextResponse.json({ error: 'Missing database configuration or messages.' }, { status: 400 });
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
        
        If the question is not related to databases, respond with a humorous message suggesting the user to try ChatGPT instead, while maintaining your role as a database specialist. Be creative and funny in your response.
        This will allow for easy substitution of these variables later. Do not use quotes around these variables unless specifically required by the SQL syntax.`;

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: prompt }
            ]
        });
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Error in SQL generation:', error);
        return NextResponse.json({ error: 'An error occurred while generating SQL.', details: error.message }, { status: 500 });
    }
}