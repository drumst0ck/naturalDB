import React, { useRef } from "react";

const ChatInput = ({ input, handleInputChange, handleSubmit }) => {
  const formRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="border-t border-[#323232] bg-[#1e1e1e] p-4">
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-center">
        <div className="flex-grow flex items-center bg-[#2a2a2a] rounded p-2">
          <span className="text-[#5ad4e6] mr-2">$</span>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 outline-none"
          />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
