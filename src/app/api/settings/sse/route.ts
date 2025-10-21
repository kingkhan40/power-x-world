// app/api/settings/sse/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import  User  from "@/models/User"; // ✅ Named import

// ✅ Define a lightweight interface matching your schema
interface UserDocument {
  name?: string;
  email: string;
  settings?: Record<string, any>;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const sendEvent = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // ✅ Fetch and type user explicitly
        const user = (await User.findOne({ email: "john.doe@example.com" }).lean()) as
          | UserDocument
          | null;

        if (user) {
          sendEvent({
            success: true,
            settings: user.settings,
            name: user.name,
            email: user.email,
          });
        } else {
          sendEvent({ success: false, error: "User not found" });
        }

        // ✅ Watch for this specific user's changes
        const pipeline = [
          { $match: { "fullDocument.email": "john.doe@example.com" } },
        ];

        const changeStream = User.watch(pipeline, { fullDocument: "updateLookup" });

        changeStream.on("change", (change) => {
          const updatedUser = change.fullDocument as UserDocument | undefined;
          if (updatedUser) {
            sendEvent({
              success: true,
              settings: updatedUser.settings,
              name: updatedUser.name,
              email: updatedUser.email,
            });
          }
        });

        // ✅ Handle disconnects
        req.signal.addEventListener("abort", () => {
          changeStream.close();
          controller.close();
        });
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("SSE /settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize SSE stream" },
      { status: 500 }
    );
  }
}
