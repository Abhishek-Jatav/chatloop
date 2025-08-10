"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup when unmounting
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  return (
    <div className="p-4">
      <div className="border p-2 mb-2 h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
