import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://powerxworld.uk";

const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("🟢 Connected to Socket.IO server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Disconnected from Socket.IO server:", reason);
});

socket.on("connect_error", (error) => {
  console.error("⚠️ Socket connection error:", error.message);
});

export default socket;
