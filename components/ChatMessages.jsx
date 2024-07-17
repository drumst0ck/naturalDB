import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Code, Table } from "lucide-react";
import RenderQuery from "./RenderQuery";
import { RenderSQLCode } from "./RenderSqlCode";
import {
  isSafeSQL,
  formatTimestamp,
  extractJsonFromString,
} from "./../lib/chatUtils";

const ChatMessages = ({
  messages,
  isLoading,
  selectedMessage,
  setSelectedMessage,
  copiedStates,
  setCopiedStates,
  executeQuery,
  toggleMessageView,
  isLastMessage,
}) => {
  const [executingQueries, setExecutingQueries] = useState({});

  const handleExecuteQuery = async (messageId, query) => {
    setExecutingQueries((prev) => ({ ...prev, [messageId]: true }));
    await executeQuery(query);
    setExecutingQueries((prev) => ({ ...prev, [messageId]: false }));
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
    const isInitialMessage = message.id === "initial-message";
    const extractedJson = isQueryResult
      ? extractJsonFromString(message.content)
      : null;
    const canRenderAsTable = extractedJson !== null;
    const isExecuting = executingQueries[message.id];

    return (
      <motion.div
        key={message.id}
        ref={isLastMessage ? lastMessageRef : null}
        id={`message-${message.id}`}
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
        {isSelected && (
          <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate">
            <div className="h-full w-full bg-[#1e1e1e] rounded-lg" />
          </div>
        )}

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
                {canRenderAsTable && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMessageView(message.id);
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs flex gap-2"
                  >
                    {message.viewMode === "table" ? (
                      <Code className="h-4 w-4" />
                    ) : (
                      <Table className="h-4 w-4" />
                    )}
                    {message.viewMode === "table"
                      ? "View as JSON"
                      : "View as Table"}
                  </Button>
                )}
              </div>
              {RenderQuery(
                message.content.replace("Query Result:\n\n", ""),
                message.viewMode || "json"
              )}
            </div>
          ) : isSQL && !isInitialMessage ? (
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
          {isSQL && !isInitialMessage && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleExecuteQuery(message.id, message.content);
              }}
              className="self-start mt-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white"
              disabled={isExecuting}
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
    </div>
  );
};

export default ChatMessages;
