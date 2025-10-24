<<<<<<< Updated upstream
=======
// server/socket-server.ts
// Run with: npx ts-node server/socket-server.ts
>>>>>>> Stashed changes
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

<<<<<<< Updated upstream

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

app.use(express.json());

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

      // 🔄 Example: handle a test event
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
 * ✅ Get Socket.io instance safely (for use in Next.js API routes)
 */
export function getIO(): Server {
  if (!io) {
    throw new Error("❌ Socket.IO not initialized! Please call initSocket() first.");
  }
  return io;
}

/**
 * ✅ HTTP fallback emit endpoint (for Next.js APIs to trigger events)
 */
app.post("/emit", (req: Request, res: Response) => {
  try {
    const { event, payload } = req.body;
    console.log(`📡 Emitting event: ${event}`, payload);

    if (!io) {
      throw new Error("Socket.IO not initialized");
    }

    io.emit(event, payload);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Emit Error:", error);
    res.status(500).json({ error: "Emit failed" });
  }
});

// ✅ Start server only when run directly
const isDirectRun =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("socket-server.ts");

if (isDirectRun) {
  const PORT = Number(process.env.SOCKET_PORT) || 4000;
  initSocket(server);
  server.listen(PORT, () => {
    console.log("✅ Socket.IO server initialized");
    console.log(`🚀 Socket.IO server running on port ${PORT}`);
  });
}


export { app, io, server };
=======
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
>>>>>>> Stashed changes
