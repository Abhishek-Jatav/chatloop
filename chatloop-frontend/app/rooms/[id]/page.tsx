"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast, Toaster } from "react-hot-toast";

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
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch messages");
      const msgs = await res.json();
      setMessages(msgs);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching messages");
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
        toast.error("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
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
      fetchMessages();
      toast.success("Message sent");
    } catch (error) {
      console.error(error);
      toast.error("Error sending message");
    }
  };

  if (loading)
    return <p className="p-4 text-gray-300 text-lg">Loading room...</p>;
  if (!room) return <p className="p-4 text-gray-300 text-lg">Room not found</p>;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 md:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Room Details */}
      <div className="bg-gray-800 shadow rounded p-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Room ID: {room.id}
        </h1>
        <p className="text-gray-400 text-lg mb-2">Members in this room:</p>
        <ul className="list-disc list-inside space-y-1">
          {room.users.map((user: any) => {
            const isCurrentUser = String(currentUser?.id) === String(user.id);
            return (
              <li
                key={user.id}
                className={`text-lg p-1 rounded ${
                  isCurrentUser
                    ? "font-bold text-blue-300 bg-blue-900"
                    : "text-gray-200"
                }`}>
                {user.username} ({user.email}){isCurrentUser && " ← You"}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Messages */}
      <div className="bg-gray-800 shadow rounded p-4 mb-4 max-h-[400px] overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-3">Messages</h2>
        {messages.length > 0 ? (
          <ul className="space-y-3">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="border-b border-gray-700 pb-2 text-lg">
                <strong className="text-blue-300">
                  {msg.sender.username}:
                </strong>{" "}
                <span>{msg.content}</span>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        ) : (
          <p className="text-gray-500 text-lg">No messages yet.</p>
        )}
      </div>

      {/* Send Message */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-700 bg-gray-700 text-gray-200 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded text-lg hover:bg-blue-700 transition">
          Send
        </button>
      </div>
    </main>
  );
}
