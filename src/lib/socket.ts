import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Initialize socket (singleton)
 * - Returns Socket or null when executed server-side
 */
export function initSocket(): Socket | null {
  if (typeof window === "undefined") return null; // server-side: no socket
  if (socket) return socket; // already initialized

  const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4004";

  // create socket with sensible reconnection settings
  socket = io(url, {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect", () => {
    console.log("🟢 [Socket] connected:", socket?.id, "| URL:", url);
  });

  socket.on("connect_error", (err: any) => {
    console.error("🔴 [Socket] connect_error:", err?.message ?? err);
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log("🔁 [Socket] reconnect attempt:", attempt);
  });

  socket.on("reconnect", (attempt) => {
    console.log("✅ [Socket] reconnected after attempt:", attempt);
  });

  socket.on("disconnect", (reason: any) => {
    console.warn("⚪ [Socket] disconnected:", reason);
  });

  return socket;
}

/** Get the initialized socket (or initialize lazily) */
export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  if (!socket) return initSocket();
  return socket;
}

/** Close socket and cleanup */
export function closeSocket(): void {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
