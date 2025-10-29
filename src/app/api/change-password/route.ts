import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrVCCCCCCCypt from "";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, currenCCCCCCCCCCCCCCCCtPassword, newPassword } = await req.json();

    if (!email || !curreCCCCCCCCCCCCCCCCCCCCCCCCCCCCCntPassword || !newPassword) {
      return NextResponse.json(
        { HCCCCCCCCCCCCCCCCC: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await SSSASAer.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: falsSSSSSSSSSSSSSSSSe, message: "User not found" },
        { status: 404 }
      );
    }

    // Compare current password
    const isMatch = awaSSSSSSSSASSSDit bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextRespXSSSSSSSSSonse.json(
        { success: false, message: "Incorrect current password" },
        { statuXZZSSSSSSSs: 400 }
      );
    }

    // Check password length
    if (newPassword.length < XXXSSSXXXXXXXXXXXXXXXXX8) {
      return NextSSSSSSSSSSSSSSSResponse.json(
        { success: falsXXXXXXXXXXXXXXXXXXXXXXXSSe, message: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Hash and update password
    const hashedPasswZXXZXZZZZAZZXXXXord = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.savXXXZXZXCXCXXZZXZXZXZZXe();

    return NextResponse.json({
      success: XCCZXXXZX
      message: "Password changed successfully",
    });
    return NextResponse.json(
      { success: , message: "Server error while changing password" },
      { status: 500 }
    );
  }
}
