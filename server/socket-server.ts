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

// ✅ Initialize Express App
const app = express();

// ✅ Define Allowed Origin (fallback system)
const allowedOrigin =
  process.env.CLIENT_URL ||
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  "http://localhost:3000";

// ✅ Setup CORS (local + live both supported)
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(json());

// ✅ Create HTTP server
const server = http.createServer(app);

/**
 * ✅ Initialize Socket.IO (sirf ek dafa)
 */
export function initSocket(serverInstance?: http.Server): Server {
  if (!io) {
    io = new Server(serverInstance || server, {
      cors: {
        origin: allowedOrigin,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 Socket connected:", socket.id);

      // 🔹 Register wallet to a unique socket room
      socket.on("register", (payload: { wallet?: string }) => {
        try {
          const wallet = payload?.wallet?.toLowerCase?.();
          if (!wallet) return;
          socket.join(wallet); // each wallet gets its own room
          console.log(`[socket] socket ${socket.id} joined room ${wallet}`);
        } catch (err) {
          console.error("register error", err);
        }
      });

      // 🔹 Test Event
      socket.on("testEvent", (data) => {
        console.log("📩 testEvent received:", data);
        socket.emit("serverResponse", {
          message: "Server received your data!",
        });
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
 * ✅ Manual emit endpoint (backend APIs socket event trigger kar sakti hain)
 */
app.post("/emit", (req, res) => {
  try {
    const { event, payload, wallet } = req.body;
    console.log(`📡 Emitting event: ${event}`, payload);

    if (!io) {
      throw new Error("Socket.IO not initialized");
    }

    // 🔹 If wallet provided → emit to that specific room
    if (wallet) {
      io.to(wallet.toLowerCase()).emit(event, payload);
      console.log(`🎯 Event sent to wallet room: ${wallet}`);
    } else {
      io.emit(event, payload);
      console.log(`🌍 Event broadcasted globally`);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("❌ Emit Error:", error);
    res.status(500).json({ error: "Emit failed" });
  }
});

/**
 * 🕒 Auto Reward Cron Job (Har Minute chalti hai)
 */
cron.schedule("* * * * *", async () => {
  try {
    // 👇 Environment ke hisaab se API URL select karega
    const targetUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/invest/reward`
        : "http://localhost:3000/api/invest/reward";

    await axios.post(targetUrl);
    console.log("✅ Reward updated successfully");
  } catch (err: any) {
    console.error("❌ Error updating reward:", err.message);
  }
});

/**
 * ✅ Server start condition (har env me chal jayega)
 */
if (process.argv[1]?.includes("socket-server.ts")) {
  const PORT = Number(process.env.SOCKET_PORT) || 4004;

  initSocket(server);

  server.listen(PORT, () => {
    console.log("🚀 Socket.IO server running on port", PORT);
    console.log("🌐 Allowed Origin:", allowedOrigin);
  });
}

export { app, io, server };
