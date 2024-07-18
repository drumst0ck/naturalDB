import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
          copyToClipboard(sql, messageId, setCopiedStates);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copiedStates[messageId] ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Check className="h-4 w-4 text-green-500" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Copy className="h-4 w-4 text-gray-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
export const copyToClipboard = async (text, messageId, setCopiedStates) => {
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
