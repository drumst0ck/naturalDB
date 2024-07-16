import { formatSchemaForDisplay } from "@/lib/utils";

const STORAGE_KEY_PREFIX = "chat_history_";

export const addTimestamp = (message) => ({
  ...message,
  timestamp: new Date().toISOString(),
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
    const jsonStart = str.indexOf("{");
    const jsonEnd = str.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = str.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
  return null;
};

export const executeQuery = async (query, dbConfig) => {
  try {
    const statements = query.split(";").filter((stmt) => stmt.trim() !== "");
    let results = [];

    for (let statement of statements) {
      const response = await fetch("/api/execute-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: statement.trim(), dbConfig }),
      });

      if (!response.ok) {
        throw new Error(`Error executing statement: ${statement}`);
      }

      const result = await response.json();
      results.push(result);
    }

    return results
      .map((result, index) => {
        if (Array.isArray(result) && result.length === 0) {
          return `Statement ${index + 1}: Operation completed successfully.`;
        } else {
          return `Statement ${index + 1}: ${JSON.stringify(result, null, 2)}`;
        }
      })
      .join("\n\n");
  } catch (error) {
    return `Error: ${error.message}`;
  }
};

export const clearConsole = (setMessages, id) => {
  const initialMessage = {
    id: "initial-message",
    role: "assistant",
    content: "Console cleared. How can I assist you?",
    timestamp: new Date().toISOString(),
  };
  setMessages([initialMessage]);
  localStorage.setItem(
    STORAGE_KEY_PREFIX + id,
    JSON.stringify([initialMessage])
  );
};

export const loadMessages = (id) => {
  const savedMessages = localStorage.getItem(STORAGE_KEY_PREFIX + id);
  if (savedMessages) {
    return JSON.parse(savedMessages);
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
