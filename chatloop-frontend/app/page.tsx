"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    setLoggedIn(!!token);

    toast.success("Welcome to Chat App!");
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#222", // darker for dark mode
            color: "#eee", // light text
            fontSize: "16px",
            fontWeight: "600",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <main
        className="
          flex flex-col items-center justify-center min-h-screen
          px-6 sm:px-12 md:px-24
          gap-10
          bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
          text-white
        ">
        <h1
          className="
            text-center font-extrabold
            text-4xl sm:text-5xl md:text-6xl
            max-w-4xl
            leading-tight sm:leading-snug md:leading-relaxed
            select-none
          ">
          Welcome to Chat App
        </h1>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
          <Link
            href="/register"
            className="
              px-10 py-4 text-center
              bg-blue-700 hover:bg-blue-800 transition
              rounded-lg
              text-xl sm:text-lg md:text-xl
              font-semibold
              shadow-lg
              select-none
              min-w-[140px]
            ">
            Register
          </Link>

          <Link
            href="/login"
            className="
              px-10 py-4 text-center
              bg-green-700 hover:bg-green-800 transition
              rounded-lg
              text-xl sm:text-lg md:text-xl
              font-semibold
              shadow-lg
              select-none
              min-w-[140px]
            ">
            Login
          </Link>
        </div>
      </main>
    </>
  );
}
