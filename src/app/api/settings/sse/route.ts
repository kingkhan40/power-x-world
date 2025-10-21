// app/api/settings/sse/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import  User  from "@/models/User";

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      await connectDB();
      const encoder = new TextEncoder();

      // Initial settings
      const user = await User.findOne({ email: "john.doe@example.com" });
      if (user) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(user.settings)}\n\n`));
      }

      // Change Stream
      const changeStream = User.watch();
      changeStream.on("change", async () => {
        const updatedUser = await User.findOne({ email: "john.doe@example.com" });
        if (updatedUser) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(updatedUser.settings)}\n\n`));
        }
      });

      req.signal.addEventListener("abort", () => {
        changeStream.close();
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}