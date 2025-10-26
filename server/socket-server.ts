// Run with: npx ts-node server/socket-server.ts
import expressPkg from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import axios from "axios";

dotenv.config();

const express = expressPkg;
const { json } = expressPkg;

let io: Server | null = null;

// ✅ Initialize Express app
const app = express();

// ✅ Setup CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(json());

// ✅ Create HTTP server
const server = http.createServer(app);

/**
 * ✅ Initialize Socket.io (only once)
 */
export function initSocket(serverInstance?: http.Server): Server {
  if (!io) {
    io = new Server(serverInstance || server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 Socket connected:", socket.id);

      // Example test event
      socket.on("testEvent", (data) => {
        console.log("📩 testEvent received:", data);
        socket.emit("serverResponse", { message: "Server received your data!" });
      });

      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
      });
    });

    console.log("✅ Socket.IO server initialized");
  }

  return io;
}

/**
 * ✅ HTTP fallback emit endpoint
 */
app.post("/emit", (req, res) => {
  try {
    const { event, payload } = req.body;
    console.log(`📡 Emitting event: ${event}`, payload);

    if (!io) {
      throw new Error("Socket.IO not initialized");
    }

    io.emit(event, payload);
    res.json({ success: true });
  } catch (error: any) {
    console.error("❌ Emit Error:", error);
    res.status(500).json({ error: "Emit failed" });
  }
});

/// 🕒 Auto reward updater every minute
cron.schedule("* * * * *", async () => {
  try {
    await axios.post("http://localhost:3000/api/invest/reward");
    console.log("✅ Reward updated successfully");
  } catch (err: any) {
    console.error("❌ Error updating reward:", err.message);
  }
});


// ✅ Start server if run directly
const isDirectRun =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("socket-server.ts");

if (isDirectRun) {
  const PORT = Number(process.env.SOCKET_PORT) || 4004;
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`🚀 Socket.IO server running on port ${PORT}`);
  });
}

export { app, io, server };
