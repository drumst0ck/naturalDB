import { formatSchemaForDisplay } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY_PREFIX = "chat_history_";

export const addTimestamp = (message) => ({
  ...message,
  timestamp: new Date().toISOString(),
  id: message.id || uuidv4(),
});

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const isSafeSQL = (sql) => {
  const upperSQL = sql.toUpperCase();
  return (
    upperSQL.includes("SELECT") ||
    upperSQL.includes("INSERT") ||
    upperSQL.includes("UPDATE") ||
    upperSQL.includes("DELETE") ||
    upperSQL.includes("CREATE") ||
    upperSQL.includes("ALTER") ||
    upperSQL.includes("DROP")
  );
};

export const extractJsonFromString = (str) => {
  try {
    const jsonMatch = str.match(/{.*}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
  return null;
};

export const executeQuery = async (query, dbConfig) => {
  try {
    const statements = query
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt !== "");

    let results = [];

    for (let statement of statements) {
      const response = await fetch("/api/execute-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: statement, dbConfig }),
      });

      if (!response.ok) {
        throw new Error(`Error executing statement: ${statement}`);
      }

      const result = await response.json();
      results.push({
        query: statement,
        result: result,
        success: true,
        message:
          Array.isArray(result) && result.length === 0
            ? "Operation completed successfully."
            : null,
      });
    }

    return results;
  } catch (error) {
    return [
      {
        query: query,
        result: null,
        success: false,
        message: `Error: ${error.message}`,
      },
    ];
  }
};

export const clearConsole = (setMessages, id, dbSchema) => {
  const initialMessage = {
    id: "initial-message",
    role: "assistant",
    content: `Hi! I have analyzed your database schema. Here is a summary:
              ${formatSchemaForDisplay(dbSchema)}
              I am ready to help you with queries related to this database, what would you like to know?`,
    timestamp: new Date().toISOString(),
  };
  const clearMessage = {
    id: uuidv4(),
    role: "assistant",
    content: "Console cleared. How can I assist you?",
    timestamp: new Date().toISOString(),
  };
  const newMessages = [initialMessage, clearMessage];
  setMessages(newMessages);
  localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(newMessages));
  return newMessages;
};

export const loadMessages = (id) => {
  const savedMessages = localStorage.getItem(STORAGE_KEY_PREFIX + id);
  if (savedMessages) {
    return JSON.parse(savedMessages).map((msg) => ({
      ...msg,
      id: msg.id || uuidv4(),
    }));
  }
  return [];
};

export const saveMessages = (id, messages) => {
  localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(messages));
};

export const initializeChat = async (
  db,
  setDbSchema,
  setInitialMessages,
  id
) => {
  try {
    const response = await fetch("/api/get-db-schema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(db),
    });
    const schema = await response.text();
    setDbSchema(schema);

    const savedMessages = loadMessages(id);
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
      saveMessages(id, [initialAIMessage]);
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
