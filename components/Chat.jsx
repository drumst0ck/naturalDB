import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Code, Table, Database, Eraser } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { APIKeyPopup } from "./APIKeyPopup";
import { DBViewerPopup } from "./DBViewerPopup";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import useChat from "../app/hooks/useChat";
import {
  executeQuery,
  clearConsole,
  loadMessages,
  saveMessages,
} from "../lib/chatUtils";

export function Chat({ db, id }) {
  const [isDBViewerOpen, setIsDBViewerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dbSchema, setDbSchema] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [showApiKeyPopup, setShowApiKeyPopup] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    addQueryResultMessage,
  } = useChat({
    api: "/api/chat",
    initialMessages: loadMessages(id),
    body: { dbConfig: db, openaiApiKey },
  });

  useEffect(() => {
    const storedApiKey = localStorage.getItem("openai_api_key");
    if (storedApiKey) {
      setOpenaiApiKey(storedApiKey);
    } else {
      setShowApiKeyPopup(true);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "openai_api_key") {
        setOpenaiApiKey(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchDbSchema = async () => {
      try {
        const response = await fetch("/api/get-db-schema", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(db),
        });
        const schema = await response.text();
        setDbSchema(schema);
      } catch (error) {
        console.error("Error fetching database schema:", error);
      }
    };

    fetchDbSchema();
  }, [db]);

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(id, messages);
    }
  }, [messages, id]);

  const handleClearConsole = () => clearConsole(setMessages, id);

  const handleExecuteQuery = async (query) => {
    const result = await executeQuery(query, db);
    addQueryResultMessage(result);
  };

  if (showApiKeyPopup) {
    return (
      <APIKeyPopup
        onClose={() => {
          setShowApiKeyPopup(false);
          const newApiKey = localStorage.getItem("openai_api_key");
          if (newApiKey) {
            setOpenaiApiKey(newApiKey);
          }
        }}
      />
    );
  }

  if (!openaiApiKey) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">
          OpenAI API key not found. Please set your API key in the settings.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-126px)]">
      {isLoading && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 animate-gradient-x opacity-50"
            style={{
              background:
                "linear-gradient(45deg, #ff00ff, #22d3ee, #9333ea, #ec4899)",
              backgroundSize: "400% 400%",
              filter: "blur(20px)",
            }}
          />
        </motion.div>
      )}

      <div className="absolute inset-0 z-10">
        <div className="flex flex-col h-full bg-[#1e1e1e] text-white font-mono rounded-lg overflow-hidden">
          <div className="bg-[#323232] p-2 rounded-t-lg flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]">
                <Link className="h-3 w-3" href="/dashboard"></Link>
              </div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="flex-grow text-center text-sm">bash</div>
            <div className="flex space-x-2">
              <Button
                onClick={handleClearConsole}
                variant="ghost"
                size="sm"
                className="p-1"
                title="Clear console"
              >
                <Eraser className="h-4 w-4 text-[#E0E0E0]" />
              </Button>
              <Button
                onClick={() => setIsDBViewerOpen(true)}
                variant="ghost"
                size="sm"
                className="p-1"
                title="Open DB Viewer"
              >
                <Database className="h-4 w-4 text-[#E0E0E0]" />
              </Button>
            </div>
          </div>

          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
            viewMode={viewMode}
            setViewMode={setViewMode}
            copiedStates={copiedStates}
            setCopiedStates={setCopiedStates}
            executeQuery={handleExecuteQuery}
          />

          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      <DBViewerPopup
        isOpen={isDBViewerOpen}
        onClose={() => setIsDBViewerOpen(false)}
        dbConfig={db}
      />
    </div>
  );
}

export default Chat;
