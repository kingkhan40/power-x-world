// src/lib/socket.ts
import { io as ClientIO, Socket } from "socket.io-client";

let socket: Socket | null = null;

if (typeof window !== "undefined") {
  socket = ClientIO("http://localhost:3000", {
    transports: ["websocket"],
    withCredentials: true,
  });
}

export const getSocket = () => socket;