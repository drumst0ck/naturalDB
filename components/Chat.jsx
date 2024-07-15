import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Play, Code, Table } from "lucide-react";
import { formatSchemaForDisplay } from "@/lib/utils";
import RenderQuery from "./RenderQuery";
import { RenderSQLCode } from "./RenderSqlCode";
import { isSafeSQL } from "@/lib/utils";
const STORAGE_KEY_PREFIX = "chat_history_";

export function Chat({ db, id }) {
  const [viewMode, setViewMode] = useState("table");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dbSchema, setDbSchema] = useState(null);
  const [initialMessages, setInitialMessages] = useState([]);
  const [copiedStates, setCopiedStates] = useState({});

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
    const isSelected = selectedMessage === message.id;
    const isSQL =
      message.content &&
      typeof message.content === "string" &&
      isSafeSQL(message.content);
    const isQueryResult =
      message.role === "system" && message.content.startsWith("Query Result:");
    const isUser = message.role === "user";
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex flex-col space-y-2 relative p-4 mb-4 cursor-pointer
                    ${
                      isSelected
                        ? "border-2 border-transparent"
                        : "border-2 border-gray-700"
                    }
                    rounded-lg transition-all duration-300 ease-in-out`}
        onClick={() => setSelectedMessage(isSelected ? null : message.id)}
      >
        {/* Animated gradient border */}
        {isSelected && (
          <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate">
            <div className="h-full w-full bg-[#1e1e1e] rounded-lg" />
          </div>
        )}

        {/* Message content */}
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[#5ad4e6]">
              {isUser ? "user@localhost:~$" : "ai@server:~$"}
            </span>
            <span className="text-xs opacity-70">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
          {isQueryResult ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span>Query Result:</span>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode(viewMode === "table" ? "json" : "table");
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs flex gap-2"
                >
                  {viewMode === "table" ? (
                    <Code className="h-4 w-4" />
                  ) : (
                    <Table className="h-4 w-4" />
                  )}
                  {viewMode === "table" ? "View as JSON" : "View as Table"}
                </Button>
              </div>
              {RenderQuery(
                message.content.replace("Query Result:\n\n", ""),
                viewMode
              )}
            </div>
          ) : isSQL ? (
            <RenderSQLCode
              setCopiedStates={setCopiedStates}
              copiedStates={copiedStates}
              sql={message.content}
              messageId={message.id}
            />
          ) : (
            <pre className="whitespace-pre-wrap text-sm overflow-x-auto bg-[#2a2a2a] p-2 rounded">
              {message.content}
            </pre>
          )}
          {isSQL && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                executeQuery(message.content);
              }}
              disabled={isExecuting}
              className="self-start mt-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isExecuting ? "Executing..." : "Execute Query"}
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-126px)] w-full bg-[#1e1e1e] text-white font-mono">
      <div className="bg-[#323232] p-2 rounded-t-lg flex items-center">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="flex-grow text-center text-sm">bash</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => renderMessage(message))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex items-center text-[#5ad4e6]">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Processing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#323232] bg-[#1e1e1e] p-4">
        <form ref={formRef} onSubmit={onSubmit} className="flex items-center">
          <div className="flex-grow flex items-center bg-[#2a2a2a] rounded p-2">
            <span className="text-[#5ad4e6] mr-2">$</span>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your command..."
              className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 outline-none"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
