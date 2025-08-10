"use client"; // Ensure this file only runs in the browser

import { io } from "socket.io-client";

// Avoid multiple connections during hot reload
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

export default socket;
