"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration successful! You can now log in.");
        toast.success("Registration successful! You can now log in.");
      } else {
        setMessage(`❌ Error: ${data.message || "Registration failed"}`);
        toast.error(`Error: ${data.message || "Registration failed"}`);
      }
    } catch (error) {
      setMessage("❌ Network error. Is backend running?");
      toast.error("Network error. Is backend running?");
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

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 sm:px-12 md:px-20">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 bg-opacity-95 p-10 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-white leading-tight">
            Register
          </h1>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-700 bg-gray-800 text-white p-4 mb-6 rounded-lg
              w-full text-lg sm:text-xl
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-700 bg-gray-800 text-white p-4 mb-6 rounded-lg
              w-full text-lg sm:text-xl
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-700 bg-gray-800 text-white p-4 mb-8 rounded-lg
              w-full text-lg sm:text-xl
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg
              w-full text-lg sm:text-xl transition-colors duration-300">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
