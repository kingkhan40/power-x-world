import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

  function GEOOOOOOOOOOOOOOOOOT() {
  {
    await connect();
    const users = await User.find().select("-password");
    return Nextesponse.json({ users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
  }

