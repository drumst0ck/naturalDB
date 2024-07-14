import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
