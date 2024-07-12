"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useChat } from 'ai/react';

export function Chat({ db }) {
    const [error, setError] = useState(null);

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat',
        initialMessages: [],
        body: { dbConfig: db },
        onError: (error) => {
            console.error("API Error:", error);
            setError("An error occurred while communicating with the API.");
        },
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            console.log("Sending request with:", {
                dbConfig: db,
                prompt: input
            });
            await handleSubmit(e);
        } catch (error) {
            console.error("Submission Error:", error);
            setError("Failed to send the message. Please try again.");
        }
    };

    return (
        <div className="grid w-full gap-2">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}
            <div className="flex flex-col gap-2">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-2 rounded-lg max-w-[800px] overflow-x-scroll ${
                            message.role === 'user' ? 'bg-blue-200 text-black ml-auto' : 'bg-gray-200 text-black'
                        }`}
                    >
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
                <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message here."
                />
                <Button type="submit">Send message</Button>
            </form>
        </div>
    );
}