import { NextResponse } from "next/server";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";

    if (record.expiresAt < new Date())
    const user = await User.findOneAndUpdate(
      { email },
      { new: true }
    );

    if (!user)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

      success: true,
      message: "Email verified successfully!",
      user,
    });
  } catch (err) {
    console.error("Verify Error:", err);
    return NextResponse.json({ success: false, message: "Error verifying user" }, { status: 500 });
  }
}
