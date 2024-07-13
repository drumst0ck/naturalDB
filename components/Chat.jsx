import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Play } from "lucide-react";

export function Chat({ db }) {
  const [dbSchema, setDbSchema] = useState(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: [],
    body: { dbConfig: db },
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const messagesEndRef = useRef(null);
  const formRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const isSelectQuery = (query) => {
    return /^SELECT/i.test(query.trim());
  };

  const executeQuery = async (query) => {
    if (!isSelectQuery(query)) {
      addQueryResultMessage(
        "Only SELECT queries are allowed for security reasons."
      );
      return;
    }

    setIsExecuting(true);
    try {
      const response = await fetch("/api/execute-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, dbConfig: db }),
      });

      if (!response.ok) {
        throw new Error("Error in query execution");
      }

      const result = await response.json();
      addQueryResultMessage(JSON.stringify(result, null, 2));
    } catch (error) {
      addQueryResultMessage(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const addQueryResultMessage = (result) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(),
        role: "system",
        content: `Query Result:\n\n${result}`,
      },
    ]);
  };

  useEffect(() => {
    // Función para obtener el esquema de la base de datos
    const fetchDbSchema = async () => {
      try {
        const response = await fetch("/api/get-db-schema", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(db),
        });
        const schema = await response.text();
        setDbSchema(schema);

        const initialAIMessage = {
          id: "initial-message",
          role: "assistant",
          content: `Hi! I have analyzed your database schema. Here is a summary:

${formatSchemaForDisplay(schema)}

I am ready to help you with queries related to this database, what would you like to know?`,
        };

        setMessages([initialAIMessage]);
      } catch (error) {
        console.error("Error fetching database schema:", error);
        setMessages([
          {
            id: "error-message",
            role: "assistant",
            content:
              "Sorry, there was a problem getting the schema from the database, how can I help you?",
          },
        ]);
      }
    };

    fetchDbSchema();
  }, [db, setMessages]);

  useEffect(scrollToBottom, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current.requestSubmit();
    }
  };

  const formatSchemaForDisplay = (schema) => {
    if (!schema) return "Scheme not available";
    schema = schema.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
    const match = schema.match(/CREATE TABLE (\w+) \(([\s\S]+)\);/);
    if (!match) return "Unrecognized scheme format";

    const [, tableName, columnsString] = match;
    const columns = columnsString
      .split(",")
      .map((col) => col.trim())
      .filter((col) => col)
      .map((col) => `  ${col}`);
    return `Tabla: ${tableName}\n\nColumnas:\n${columns.join("\n")}`;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const renderMessage = (message) => {
    const isSQL = message.content.includes("SELECT");
    return (
      <div
        className={`max-w-sm p-4 rounded-lg ${
          message.role === "user"
            ? "bg-blue-500 text-white"
            : message.role === "system"
            ? "bg-green-200 text-black"
            : "bg-gray-200 text-black"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {isSQL && (
          <Button
            onClick={() => executeQuery(message.content)}
            disabled={isExecuting}
            className="mt-2"
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isExecuting ? "Executing..." : "Execute Query"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {renderMessage(message)}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-black max-w-sm p-4 rounded-lg flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>{"I'll need a second to take a look at this..."}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form ref={formRef} onSubmit={onSubmit} className="p-4 border-t">
        <div className="flex space-x-4">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here. Press Enter to send, Shift+Enter for new line."
            className="flex-1"
            rows={1}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
