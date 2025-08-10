// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    setLoggedIn(!!token);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Welcome to Chat App</h1>
      <Link
        href="/register"
        className="px-4 py-2 bg-blue-500 text-white rounded">
        Register
      </Link>
      <Link href="/login" className="px-4 py-2 bg-green-500 text-white rounded">
        Login
      </Link>
      {loggedIn ? (
        <Link
          href="/chat"
          className="px-4 py-2 bg-purple-500 text-white rounded">
          Rooms
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
          Rooms (Login first)
        </button>
      )}
    </main>
  );
}
