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
export const renderSQLCode = (sql) => (
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
    {sql}
  </SyntaxHighlighter>
);
export const isSafeSQL = (sql) => {
  const upperSQL = sql.toUpperCase();
  return (
    !upperSQL.includes("DROP") &&
    (upperSQL.includes("SELECT") ||
      upperSQL.includes("INSERT") ||
      upperSQL.includes("UPDATE") ||
      upperSQL.includes("DELETE") ||
      upperSQL.includes("CREATE") ||
      upperSQL.includes("ALTER"))
  );
};
