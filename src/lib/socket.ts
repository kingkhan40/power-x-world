import { io, Socket } from "socket.io-client";

// ✅ Use environment variable or fallback
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

// ✅ Create single socket instance
const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// ✅ Connection logs
socket.on("connect", () => {
  console.log("🟢 Connected to Socket.IO server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Disconnected from Socket.IO server:", reason);
});

// ✅ Export default for simple import usage
export default socket;