import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const formatSchemaForDisplay = (schema) => {
  if (!schema) return "<p>Schema not available</p>";
  schema = schema.replace(/^"|"$/g, "").replace(/\\n/g, "\n");

  const tables = schema
    .split(/(?=CREATE TABLE)/i)
    .filter((table) => table.trim() !== "");

  if (tables.length === 0) return "<p>Unrecognized schema format</p>";

  let html = '<table class="min-w-full bg-[#2a2a2a] text-sm border-collapse">';
  html += '<thead><tr class="bg-[#3a3a3a]">';
  html +=
    '<th class="px-4 py-2 text-left text-[#5ad4e6] border border-gray-700">Table</th>';
  html +=
    '<th class="px-4 py-2 text-left text-[#5ad4e6] border border-gray-700">Column</th>';
  html +=
    '<th class="px-4 py-2 text-left text-[#5ad4e6] border border-gray-700">Details</th>';
  html += "</tr></thead><tbody>";

  tables.forEach((table) => {
    const match = table.match(/CREATE TABLE (\w+) \(([\s\S]+?)\)/i);
    if (!match) return;

    const [, tableName, columnsString] = match;
    const columns = columnsString
      .split(",")
      .map((col) => col.trim())
      .filter((col) => col)
      .map((col) => {
        const [name, ...details] = col.split(" ");
        return { name, details: details.join(" ") };
      });

    columns.forEach((column, index) => {
      html += '<tr class="border-b border-gray-700">';
      if (index === 0) {
        html += `<td rowspan="${columns.length}" class="px-4 py-2 align-top font-medium border border-gray-700">${tableName}</td>`;
      }
      html += `<td class="px-4 py-2 border border-gray-700">${column.name}</td>`;
      html += `<td class="px-4 py-2 border border-gray-700">${column.details}</td>`;
      html += "</tr>";
    });
  });

  html += "</tbody></table>";
  return html;
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
