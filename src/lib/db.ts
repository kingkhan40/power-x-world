import mongoose from "mongoose";
import path from "path";
import { config } from "dotenv";

/* ---------------------------------------------
 * 🌍 Load .env.local manually if not already loaded
 * --------------------------------------------- */

if (!process.env.MONGODB_URI) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  console.log("📦 Loading environment from:", envPath);
  config({ path: envPath });
}

/* ---------------------------------------------
 * ⚙️ Validate MongoDB URI
 * --------------------------------------------- */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in your .env.local or Vercel environment");
}

/* ---------------------------------------------
 * 🔄 Cached connection handler
 * --------------------------------------------- */

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = {
  conn: null,
  promise: null,
};

/* ---------------------------------------------
 * 🔗 MongoDB Connection Function
 * --------------------------------------------- */

export async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⚡ Connecting to MongoDB...");
    // ✅ Fix: explicitly tell TS this is a string
    cached.promise = mongoose.connect(MONGODB_URI as string, {
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
