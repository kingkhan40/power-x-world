import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "";

export async . disabled — contact admin" },
        { status: 403 }
      );
    }

    const isValid = await , user.password);
    if (!isValid)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // ✅ Return all important data for frontend
    return NextResponse.json({
      message: "Login successful",
      token,
      userId: user._id,
      userName: 
      userEmail: user.email,
      referralLink: `${process.env.NEXT_PUBLIC_BASE_URL}/register?ref=${user.referralCode}`,
    });
}
