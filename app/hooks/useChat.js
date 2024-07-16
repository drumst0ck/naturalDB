import { useEffect, useCallback } from "react";
import { useChat as useVercelChat } from "ai/react";
import { addTimestamp } from "../../lib/chatUtils";

const useChat = ({ api, initialMessages, body }) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useVercelChat({
    api,
    initialMessages,
    body,
    onResponse: (response) => {
      const newMessage = addTimestamp({
        id: Date.now(),
        role: "assistant",
        content: response.content,
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    },
  });

  const addQueryResultMessage = useCallback(
    (result) => {
      const newMessage = addTimestamp({
        id: Date.now(),
        role: "system",
        content: `Query Result:\n\n${result}`,
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    },
    [setMessages]
  );

  useEffect(() => {
    if (messages.length > 0) {
      const messagesWithTimestamps = messages.map((msg) =>
        msg.timestamp ? msg : addTimestamp(msg)
      );
      setMessages(messagesWithTimestamps);
    }
  }, [messages, setMessages]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    addQueryResultMessage,
  };
};

export default useChat;
