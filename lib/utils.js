import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const formatSchemaForDisplay = (schema) => {
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
export const renderSQLCode = (sql) => {
  const jsonString = JSON.stringify(sql);
  const obj = JSON.parse(jsonString);

  return (
    <SyntaxHighlighter
      language="sql"
      style={vscDarkPlus}
      customStyle={{
        background: "transparent",
        padding: "1em",
        margin: "0",
        borderRadius: "4px",
      }}
    >
      {JSON.stringify(obj, null, 2)}
    </SyntaxHighlighter>
  );
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
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
export const isJsonString = (str) => {
  try {
    const json = JSON.parse(str);
    return typeof json === "object" && json !== null;
  } catch (e) {
    return false;
  }
};
export const extractJsonFromString = (str) => {
  const match = str.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (e) {
      return null;
    }
  }
  return null;
};
