"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      Cookies.set("access_token", data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      toast.success("Login successful! Redirecting...");
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#222",
            color: "#eee",
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

      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 sm:px-12 md:px-20">
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold mb-10 select-none">
          Login
        </h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-6 bg-gray-900 bg-opacity-95 p-10 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-700 bg-gray-800 text-white px-4 py-3 rounded-lg
              text-lg sm:text-xl
              focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-700 bg-gray-800 text-white px-4 py-3 rounded-lg
              text-lg sm:text-xl
              focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg
              text-lg sm:text-xl transition-colors duration-300">
            Login
          </button>
        </form>
        {error && (
          <p className="text-red-500 text-lg mt-4 select-none max-w-md text-center">
            {error}
          </p>
        )}
      </main>
    </>
  );
}
