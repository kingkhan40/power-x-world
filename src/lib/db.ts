import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  // Log to confirm env is being read
  console.log("🔍 MONGODB_URI:", uri ? "Loaded ✅" : "❌ Not Loaded");

  if (!uri) {
    throw new Error("❌ MONGODB_URI is undefined — check .env.local placement");
  }

  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(uri);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
