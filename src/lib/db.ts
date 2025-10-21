// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// 🔒 Ensure environment variable exists
if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in your .env.local file");
}

// Connection cache (for Next.js hot reload)
let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnected: boolean;
} = {
  conn: null,
  promise: null,
  isConnected: false,
};

/**
 * 📦 connectDB()
 * Reuses cached connection during hot reloads (Next.js API routes)
 * Logs connection status and handles missing .env values gracefully.
 */
export async function connectDB() {
  // ✅ Return existing connection if available
  if (cached.conn) {
    if (!cached.isConnected) {
      cached.isConnected = cached.conn.connections[0].readyState === 1;
    }
    if (cached.isConnected) {
      console.log("✅ Using existing MongoDB connection");
      return cached.conn;
    }
  }

  // 🧩 Log environment readiness
  console.log("🔍 MONGODB_URI:", MONGODB_URI ? "Loaded ✅" : "❌ Not Loaded");

  // 🚀 If no promise, start a new connection attempt
  if (!cached.promise) {
    console.log("⚡ Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    cached.isConnected = cached.conn.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully");
    return cached.conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    cached.promise = null;
    throw err;
  }
}
