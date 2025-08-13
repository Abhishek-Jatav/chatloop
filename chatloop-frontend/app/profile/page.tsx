"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import RoomList from "@/components/RoomList";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Room creation state
  const [roomName, setRoomName] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get("access_token");
    const userData = Cookies.get("user");

    if (!storedToken && !userData) {
      router.push("/login");
      return;
    }

    setToken(storedToken || "");
    setUser(userData ? JSON.parse(userData) : null);
  }, [router]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 5000);
  };

  // Handle room creation
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setCreateError("Room name is required");
      toast.error("Room name is required");
      return;
    }
    setCreating(true);
    setCreateError(null);
    setCreateMessage(null);

    try {
      const res = await fetch("http://localhost:3000/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: roomName, isGroup }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create room");
      }

      const data = await res.json();
      setCreateMessage(data.message || "Room created successfully");
      toast.success(data.message || "Room created successfully");
      setRoomName("");
      setIsGroup(false);

      // Reload the page to get the updated room list
      window.location.reload();
    } catch (err: any) {
      setCreateError(err.message);
      toast.error(err.message || "Error creating room");
    } finally {
      setCreating(false);
    }
  };

  if (!user) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-10 text-lg">
      <Toaster position="top-center" />

      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        {/* ID */}
        <p className="mb-2 break-all">
          <strong>ID:</strong> {user.id}
        </p>
        <button
          onClick={() => handleCopy(user.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto">
          {copied ? "Copied!" : "Copy ID"}
        </button>

        {/* Access Token */}
        <p className="mt-4 mb-2 break-all">
          <strong>Access Token:</strong> {token}
        </p>
        <button
          onClick={() => handleCopy(token || "")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full sm:w-auto">
          {copied ? "Copied!" : "Copy Token"}
        </button>

        {/* User Info */}
        <p className="mt-4">
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        {/* Create Room Form */}
        <div className="mt-8 text-left">
          <h2 className="text-2xl font-semibold mb-4">Create New Room</h2>

          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full p-3 border border-gray-500 rounded bg-gray-700 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="inline-flex items-center mb-4 text-base">
            <input
              type="checkbox"
              checked={isGroup}
              onChange={() => setIsGroup(!isGroup)}
              className="form-checkbox text-blue-500"
            />
            <span className="ml-2">Is Group Room</span>
          </label>

          <button
            onClick={handleCreateRoom}
            disabled={creating}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50 w-full sm:w-auto">
            {creating ? "Creating..." : "Create Room"}
          </button>

          {/* Feedback messages */}
          {createMessage && (
            <p className="mt-3 text-green-400 font-medium">{createMessage}</p>
          )}
          {createError && (
            <p className="mt-3 text-red-400 font-medium">{createError}</p>
          )}
        </div>
      </div>

      {/* Rooms List Below Profile */}
      <div className="mt-6 w-full max-w-4xl">
        <RoomList />
      </div>
    </main>
  );
}
