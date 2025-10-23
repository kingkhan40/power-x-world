// server/socket-server.ts
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Setup CORS
app.use(
  cors({
    origin: "http://localhost:3000", // update when deployed
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ✅ Socket connection event
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ HTTP fallback emit endpoint (Next.js API can POST here)
app.post("/emit", (req: Request, res: Response) => {
  try {
    const { event, payload } = req.body;
    console.log(`📡 Emitting: ${event}`, payload);

    io.emit(event, payload);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Emit Error:", error);
    res.status(500).json({ error: "Emit failed" });
  }
});

export { io };

// ✅ Start Server
const PORT = Number(process.env.SOCKET_PORT) || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
