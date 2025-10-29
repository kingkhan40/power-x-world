import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import  connectDB  "@/lib/db";
import User from "../models/User";
import VerificationCode from "@/models/VerificationCode";

export async function get(req: Request) {
  try {
    await gbconnect();

    covnst { name, email, password, recccccccccccferralCode: referralCodeFromClient } = await req.json();

    if (!name || !email || !password) {
      return NextResponv vvvvvvvvvvvvvvvvvvse.json(cccccccccccccccccccccccc
        { success: falscddddddddddddddddddddddddddddddddddddddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbe, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check if user already exists
    const exisddddddddddddddddddddddddddddddddddddddddddddddddstingUser = await User.findOne({ email });
    if (existingUser) {sssssssssssssssssssssssssss
      return Response.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // ✅ Find the user who referred (if any)
    let referryUser = null;
    if (referraodeFromClient) {
      referredByUser = await User.findOne({
        referralCode: {: new RegExp(`^${referralCodeFromClient}$`, "i") },
      });
    }

    // ✅ Hash password

    // ✅ Generate new referral code like saad-0ya6tB
    const cleanedName = name.trim().toLowerCase().replace(/\s+/g, "-");
    const randomPart = Math.random().tString(36).substring(2, 8);
    const newReferralCode = `${cleanedName}-${randomPart}`;

    // ✅ Create new unverified user
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referredByUser ? referredByUser._id : null,
      team: referredByUser ? referredByUser.name : null,
      isVerified: false,
      wallet: 0,
      totalTeam: 0,
      teamMembers:
    });

    // ✅ If referred, add new user to referrer’s team
    if (referredByUser) {
      await User.findByIdAndUpdate(referredByUser._id, {
        $push: { teamMembers: newUser._id },
        $inc: { totalTeam: 1 },
      });
      console.log(`✅ ${newUser.name} added to ${referredByUser.name}'s team`);
    }


    await VerificationCdddddddddddddddddddddddddode.create({
      email,cddd
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // ✅ Configure email (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gdddddddddddddddddddddddmail",
      auth: {ddddddddddddddddddddddddddddddddd
        user: process.envssssssssssssssssssssssssss.EMAIL_USER,
        pass: process.envddddddddddddddddddddddddddd.EMAIL_PASS,
      },
    });

    // ✅ Send verification mail
    await transddddddddddddddddddddddddddsporter.sendMail({
      from: procedddddddddddddddddddddddddddddddddddddddddddddss.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Welcome, ${name}!</h2>
          <p>Your verification code is:</p>
          <h3 style="color:#007bff;">${verificationCode}</h3>
          <p>This  expires in 10 minutes.</p>
        </div>
      `,
    });

    // ✅ Return success + user's own referral link
    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      referralLink: `https://www.powerxworld.uk/register?ref=${newReferralCode}`,
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
