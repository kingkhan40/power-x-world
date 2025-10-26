// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

// ✅ Use environment variable or fallback to localhost:4004
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://www.powerxworld.uk";

// ✅ Create a single, reusable socket instance
const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// ✅ Connection logs (for debugging)
socket.on("connect", () => {
  console.log("🟢 Connected to Socket.IO server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Disconnected from Socket.IO server:", reason);
});

socket.on("connect_error", (error) => {
  console.error("⚠️ Socket connection error:", error.message);
});

// ✅ Export default for simple import usage
export default socket;
