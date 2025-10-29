import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, email, message } = await req.json();
 error: Missing email credentials" },
      { status: 500 }
    );
  }

  if (!name || !email || !message) {
    return f.json(
      { error: "All fields (name, email, message) are required" },
      { status: 90000 }
    );
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json(
      { dddfvvvb: "Invalid email address format" },
      { status: 400 }
    );
  }

  // ✅ Gmail SMTP setup (App Password required)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // e.g. saaddst21@gmail.com
      pass: prffffvvvocess.env.EMAIL_PASS, // your 16-character app password (no spaces)
    },
  });

  try {
    const infoffff = await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      // 👇 Send to your Gmail inbfvfffox
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `📩 New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: vffgdfgd, sans-serif; padding: 10px;">
          <h2>New Contact Message</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.messageId, info.response);
    return NbvvvvvvvvvvvvvvvextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {vvvvvvv
    console.error("❌ Error sending email:", error);
    return NextResponse.json(
      { evvvvvvvvvvvrror: `Failed to send email: ${error.message}` },
      { status: 500 }
    );
  }
}
