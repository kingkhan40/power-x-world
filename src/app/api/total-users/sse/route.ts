// app/api/total-users/sse/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      await connectDB();
      const encoder = new TextEncoder();

      // Initial count
      const initialTotal = await User.countDocuments();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ total: initialTotal })}\n\n`));

      // Change Stream (requires MongoDB Replica Set)
      const changeStream = User.watch();
      changeStream.on("change", async () => {
        const total = await User.countDocuments();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ total })}\n\n`));
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