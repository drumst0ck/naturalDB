import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
export const RenderSQLCode = ({
  sql,
  messageId,
  setCopiedStates,
  copiedStates,
}) => {
  return (
    <div className="relative">
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
      <motion.button
        className="absolute top-2 right-2 p-1 bg-gray-700 rounded-md"
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard(sql, messageId);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {copiedStates[messageId] ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-300" />
        )}
      </motion.button>
    </div>
  );
};
export const copyToClipboard = async (text, messageId) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [messageId]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [messageId]: false }));
    }, 2000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};
