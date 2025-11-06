import { useEffect, useRef } from "react";
import { getSocket, initSocket, closeSocket } from "@/lib/socket";

/**
 * useSocket hook
 * - joinRoom: call with userId to join private room on server
 * - Provides automatic connect / cleanup
 */
export function useSocket(userId?: string | null) {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const s = initSocket();
    socketRef.current = s;

    // Optional: listen to generic serverResponse for testing
    s?.on("serverResponse", (data: any) => {
      console.log("[socket] serverResponse:", data);
    });

    return () => {
      // Remove listeners to avoid duplicates on hot reload
      s?.off("serverResponse");
      // Do NOT close socket on every unmount if you want app-wide shared socket.
      // If you want to close, uncomment:
      // closeSocket();
    };
  }, []);

  useEffect(() => {
    // join user-specific room after login (if provided)
    const s = socketRef.current;
    if (!s) return;

    if (userId) {
      s.emit("join", userId);
      console.log("[socket] join room:", userId);
    } else {
      // optional: leave room when user logs out
      // s.emit("leave", previousUserId)
    }
  }, [userId]);

  return socketRef;
}
