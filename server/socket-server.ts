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

/* ---------------------------------------------
 * 🚀 Initialize Express App
 * --------------------------------------------- */
const app = express();

/* ---------------------------------------------
 * 🌐 Allowed Origin
 * --------------------------------------------- */
const allowedOrigin =
  process.env.CLIENT_URL ||
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  "https://powerxworld.uk";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(json());

/* ---------------------------------------------
 * 🧩 Create HTTP server
 * --------------------------------------------- */
const server = http.createServer(app);

/* ---------------------------------------------
 * 🧠 Initialize Socket.IO
 * --------------------------------------------- */
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

      // 🔹 Register wallet room
      socket.on("register", (payload: { wallet?: string }) => {
        try {
          const wallet = payload?.wallet?.toLowerCase?.();
          if (!wallet) return;
          socket.join(wallet);
          console.log(`[socket] socket ${socket.id} joined room ${wallet}`);
        } catch (err) {
          console.error("register error", err);
        }
      });

      // 🔹 Test event
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

/* ---------------------------------------------
 * 📡 Manual Emit Endpoint
 * --------------------------------------------- */
app.post("/emit", (req, res) => {
  try {
    const { event, payload, wallet } = req.body;
    console.log(`📡 Emitting event: ${event}`, payload);

    if (!io) throw new Error("Socket.IO not initialized");

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

/* ---------------------------------------------
 * 🕒 Auto Reward Cron Job (Har Minute)
 * --------------------------------------------- */
cron.schedule("* * * * *", async () => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    // VPS ke liye localhost use karo (same machine par Next.js run ho raha hai)
    const targetUrl = isProduction
      ? "http://localhost:3000/api/invest/reward"
      : "http://localhost:3000/api/invest/reward";

    console.log("⏰ Running reward cron →", targetUrl);

    const response = await axios.post(targetUrl);
    console.log("✅ Reward updated successfully:", response.status);
  } catch (err: any) {
    if (err.response) {
      console.error(
        "❌ Reward API error:",
        err.response.status,
        err.response.data
      );
    } else if (err.request) {
      console.error("❌ Reward API no response:", err.request);
    } else {
      console.error("❌ Reward cron error:", err.message);
    }
  }
});

/* ---------------------------------------------
 * 🚀 Start Socket Server
 * --------------------------------------------- */
if (process.argv[1]?.includes("socket-server.ts")) {
  const PORT = Number(process.env.SOCKET_PORT) || 4004;

  initSocket(server);

  server.listen(PORT, () => {
    console.log("🚀 Socket.IO server running on port", PORT);
    console.log("🌐 Allowed Origin:", allowedOrigin);
  });
}

export { app, io, server };
