import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * ✅ Initialize socket (singleton)
 * - Prevents duplicate connections
 * - Includes safe reconnection handling
 */
export function initSocket(): Socket | null {
  if (typeof window === "undefined") return null; // SSR guard
  if (socket && socket.connected) return socket; // already connected

  const url = process.env.NEXT_PUBLIC_SOCKET_URL || "https://socket.powerxworld.uk";

  socket = io(url, {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  /* ✅ Event Handlers */
  socket.on("connect", () => {
    console.log(`🟢 [Socket] Connected → ID: ${socket?.id} | URL: ${url}`);
  });

  socket.on("connect_error", (err: any) => {
    const msg =
      typeof err === "object" && err !== null ? err.message || JSON.stringify(err) : String(err);
    console.error("🔴 [Socket] Connection Error:", msg);
  });

  socket.on("reconnect_attempt", (attempt: number) => {
    console.log(`🔁 [Socket] Reconnect Attempt #${attempt}`);
  });

  socket.on("reconnect", (attempt: number) => {
    console.log(`✅ [Socket] Reconnected Successfully (after ${attempt} attempts)`);
  });

  socket.on("disconnect", (reason: string) => {
    console.warn("⚪ [Socket] Disconnected:", reason);
  });

  return socket;
}

/**
 * ✅ Get existing socket instance (or lazy-init if not created)
 */
export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  if (!socket) return initSocket();
  return socket;
}

/**
 * ✅ Close and cleanup socket
 */
export function closeSocket(): void {
  if (socket) {
    console.log("🔻 [Socket] Disconnecting manually...");
    socket.disconnect();
    socket = null;
  }
}
