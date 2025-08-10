// app/rooms/[id]/page.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

export default function RoomPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const token = Cookies.get("access_token");
  const currentUser = Cookies.get("user")
    ? JSON.parse(Cookies.get("user")!)
    : null;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/rooms/${id}/messages?t=${Date.now()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store", // prevent caching
        }
      );
      if (!res.ok) throw new Error("Failed to fetch messages");
      const msgs = await res.json();
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id || !token) return;

    const fetchRoomDetails = async () => {
      try {
        const resUsers = await fetch(
          `http://localhost:3000/rooms/${id}/users?t=${Date.now()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );
        if (!resUsers.ok) throw new Error("Failed to fetch room details");
        const users = await resUsers.json();

        setRoom({ id, users });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000); // poll every 3 sec

    return () => clearInterval(interval);
  }, [id, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/rooms/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setNewMessage("");
      fetchMessages(); // refresh instantly
    } catch (error) {
      console.error(error);
      alert("Error sending message");
    }
  };

  if (loading) return <p className="p-4">Loading room...</p>;
  if (!room) return <p className="p-4">Room not found</p>;

  return (
    <main className="p-6">
      {/* Room Details */}
      <div className="bg-white shadow rounded p-4 mb-4">
        <h1 className="text-2xl font-bold">Room ID: {room.id}</h1>
        <p className="text-gray-600">Members in this room:</p>
        <ul className="list-disc list-inside mb-4">
          {room.users.map((user: any) => {
            const isCurrentUser = String(currentUser?.id) === String(user.id);
            return (
              <li
                key={user.id}
                className={
                  isCurrentUser
                    ? "text-lg font-bold text-blue-700 bg-blue-100 p-1 rounded"
                    : "text-gray-800"
                }>
                {user.username} ({user.email}){isCurrentUser && " ← You"}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Messages */}
      <div className="bg-white shadow rounded p-4 mb-4 max-h-[400px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Messages</h2>
        {messages.length > 0 ? (
          <ul className="space-y-2">
            {messages.map((msg) => (
              <li key={msg.id} className="border-b pb-2">
                <strong>{msg.sender.username}: </strong>
                <span>{msg.content}</span>
                <div className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        ) : (
          <p className="text-gray-500">No messages yet.</p>
        )}
      </div>

      {/* Send Message */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Send
        </button>
      </div>
    </main>
  );
}
