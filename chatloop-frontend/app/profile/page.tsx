// app/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import RoomList from "@/components/RoomList";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 5000);
  };

  if (!user) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        {/* ID */}
        <p className="mb-2">
          <strong>ID:</strong> {user.id}
        </p>
        <button
          onClick={() => handleCopy(user.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          {copied ? "Copied!" : "Copy ID"}
        </button>

        {/* Access Token */}
        <p className="mt-4 mb-2 break-all">
          <strong>Access Token:</strong> {token}
        </p>
        <button
          onClick={() => handleCopy(token || "")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
          {copied ? "Copied!" : "Copy Token"}
        </button>

        {/* User Info */}
        <p className="mt-4">
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* Rooms List Below Profile */}
      <RoomList />
    </main>
  );
}
