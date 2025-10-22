// server/socket-server.ts
// Run with: npx ts-node server/socket-server.ts
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// 🔌 Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ Change to your actual frontend domain later
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Optional endpoint (Next.js API can POST here)
app.post("/emit", (req: Request, res: Response) => {
  const { event = "depositUpdate", payload } = req.body || {};
  io.emit(event, payload);
  return res.json({ ok: true });
});

const PORT = process.env.SOCKET_PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
