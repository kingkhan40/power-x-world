import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, message } = await req.json();

  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return NextResponse.json(
      { error: "Server configuration error: Missing email credentials" },
      { status: 500 }
    );
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields (name, email, message) are required" },
      { status: 400 }
    );
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address format" },
      { status: 400 }
    );
  }

  // ✅ Gmail SMTP setup (App Password required)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // e.g. saaddst21@gmail.com
      pass: process.env.EMAIL_PASS, // your 16-character app password (no spaces)
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      // 👇 Send to your Gmail inbox
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `📩 New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>New Contact Message</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.messageId, info.response);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json(
      { error: `Failed to send email: ${error.message}` },
      { status: 500 }
    );
  }
}
