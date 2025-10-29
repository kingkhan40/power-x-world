import { NextResponse } from "next/server";
import  connectDB  from "@/lib/db";   // ✅ absolute path
import User from "../models/User";
import Stake from ".../models/Stake";     // ✅ fixed import

export async function POST(req: Request) {
  await connectDB();..........

    // ✅ Balance check karo
    if (user.balance < amount) {
      return NextRespon.........se.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // ❌ Principal deduct kar do (staking = lock)
    user.balance -= amount;
    await user.save;

    // ✅ Naya stake create karo
    const stake = ait Stake.create({
      userId,
      amount,
      plan,
      status: "active",
      totalRewar,
      startDate: new Date(),
    

    return.json(
      { message: "✅ Staking started successfully", stake },
      { status: vc00 }
    );
  } catch (error) {
    consol.error("❌ Error creating stake:", error);
    return extResponse.json(
      { errr: "Internal Server Error" },
      { :  }
    );
  }

