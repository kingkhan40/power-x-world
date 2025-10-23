// server/socket-server.ts
// Run with: npx ts-node server/socket-server.ts

import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS setup — restrict later to your actual domain
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"] }));
app.use(express.json());

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Connection events
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Optional API endpoint for emitting custom events
app.post("/emit", (req: Request, res: Response) => {
  const { event = "depositUpdate", payload } = req.body || {};
  console.log("📡 Emitting event:", event, payload);
  io.emit(event, payload);
  return res.json({ success: true });
});

// ✅ Export io for Next.js API integration
export { io };

// ✅ Start Socket.IO server
const PORT = Number(process.env.SOCKET_PORT) || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
