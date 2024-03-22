"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
export function Chat({ db }) {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  async function sendMessage() {
    const respuesta = await fetch(`/api/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: db.type,
        host: db.host,
        port: db.port,
        username: db.username,
        password: db.password,
        database: db.database,
        mensaje: message,
      }),
    })
      .then((res) => res.json())
      .then((e) => setChats([...chats, e]));
  }
  return (
    <div className="grid w-full gap-2">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="dark:bg-white bg-slate-500 p-2 rounded-lg"
        >
          <p className="dark:text-black text-white">{chat}</p>
        </div>
      ))}
      <Textarea
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here."
      />
      <Button onClick={() => sendMessage()}>Send message</Button>
    </div>
  );
}
