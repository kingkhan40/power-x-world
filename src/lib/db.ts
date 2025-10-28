// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in your .env.local or Vercel environment");
}

// Cached connection
let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = {
  conn: null,
  promise: null,
};

export async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⚡ Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected successfully");
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}
            