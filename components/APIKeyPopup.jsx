import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function APIKeyPopup({ onClose }) {
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("openai_api_key", apiKey);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md text-white font-mono"
        >
          <div className="bg-[#323232] p-2 rounded-t-lg flex items-center mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
          </div>

          {step === 1 ? (
            <>
              <h2 className="text-xl mb-4">Privacy Notice</h2>
              <p className="mb-4">
                This app is focused on privacy and open-source code. We do not
                collect any data, and everything is stored in your local browser
                storage. The app will never have access to your information,
                chats, or API keys that you provide.
              </p>
              <Button
                onClick={() => setStep(2)}
                className="w-full bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white"
              >
                Next
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl mb-4">OpenAI API Key</h2>
              <p className="mb-4">
                Please enter your OpenAI API key. You can obtain an API key from
                the{" "}
                <a
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  OpenAI dashboard
                </a>
                .
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="w-full p-2 mb-4 bg-[#2a2a2a] text-white border border-gray-700 rounded"
              />
              <Button
                type="submit"
                className="w-full bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white"
              >
                Save API Key
              </Button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
