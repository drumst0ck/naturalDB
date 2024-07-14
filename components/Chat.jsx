import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Play, Send } from "lucide-react";
import { formatSchemaForDisplay } from "@/lib/utils";
const STORAGE_KEY_PREFIX = "chat_history_";

export function Chat({ db, id }) {
  const [dbSchema, setDbSchema] = useState(null);
  const [initialMessages, setInitialMessages] = useState([]);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages,
    body: { dbConfig: db },
    onResponse: (response) => {
      // Asignar timestamp a la respuesta del asistente
      const newMessage = addTimestamp({
        id: Date.now(),
        role: "assistant",
        content: response.content,
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    },
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const messagesEndRef = useRef(null);
  const formRef = useRef(null);
  const addTimestamp = useCallback(
    (message) => ({
      ...message,
      timestamp: new Date().toISOString(),
    }),
    []
  );

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
    const newMessage = {
      id: Date.now(),
      role: "system",
      content: `Query Result:\n\n${result}`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      saveMessages(updatedMessages);
      return updatedMessages;
    });
  };

  const saveMessages = (messagesToSave) => {
    localStorage.setItem(
      STORAGE_KEY_PREFIX + id,
      JSON.stringify(messagesToSave)
    );
  };

  const loadMessages = () => {
    const savedMessages = localStorage.getItem(STORAGE_KEY_PREFIX + id);
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
    return [];
  };

  useEffect(() => {
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

        const savedMessages = loadMessages();
        if (savedMessages.length > 0) {
          setInitialMessages(savedMessages);
        } else {
          const initialAIMessage = addTimestamp({
            id: "initial-message",
            role: "assistant",
            content: `Hi! I have analyzed your database schema. Here is a summary:
                      ${formatSchemaForDisplay(schema)}
                      I am ready to help you with queries related to this database, what would you like to know?`,
          });
          setInitialMessages([initialAIMessage]);
          saveMessages([initialAIMessage]);
        }
      } catch (error) {
        console.error("Error fetching database schema:", error);
        const errorMessage = addTimestamp({
          id: "error-message",
          role: "assistant",
          content:
            "Sorry, there was a problem getting the schema from the database, how can I help you?",
        });
        setInitialMessages([errorMessage]);
      }
    };

    fetchDbSchema();
  }, [db, id, addTimestamp]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
      const messagesWithTimestamps = messages.map((msg) =>
        msg.timestamp ? msg : addTimestamp(msg)
      );
      setMessages(messagesWithTimestamps);
      saveMessages(messagesWithTimestamps);
    }
  }, [messages, id, addTimestamp, setMessages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current.requestSubmit();
    }
  };

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleSubmit(e);
    },
    [handleSubmit]
  );

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = (message) => {
    console.log(message);
    const isSQL =
      message.content &&
      typeof message.content === "string" &&
      message.content.toUpperCase().includes("SELECT");
    const isUser = message.role === "user";
    return (
      <motion.div
        key={message.id}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`max-w-2xl mx-auto my-2 p-4 rounded-3xl ${
          isUser
            ? "bg-blue-600 text-white ml-auto"
            : "bg-gray-700 text-white mr-auto"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm">{isUser ? "Usuario" : "IA"}</span>
          <span className="text-xs opacity-70">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm md:text-base">
          {message.content}
        </p>
        {isSQL && (
          <Button
            onClick={() => executeQuery(message.content)}
            disabled={isExecuting}
            className="mt-2 bg-gray-800 hover:bg-gray-900 text-white"
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isExecuting ? "Executing..." : "Execute Query"}
          </Button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-126px)] w-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((message) => renderMessage(message))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-gray-700 text-white max-w-sm p-4 rounded-3xl flex items-center space-x-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm md:text-base">Thinking...</p>
            </motion.div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <form ref={formRef} onSubmit={onSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-end space-x-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e);
                }
              }}
              placeholder="Type your message here..."
              className="flex-1 min-h-[60px] max-h-[200px] resize-none bg-gray-700 text-white border-gray-600 focus:border-blue-500 placeholder-gray-400"
              rows={1}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-[60px] px-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
