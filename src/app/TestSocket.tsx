"use client";

import { useEffect } from "react";
import socket from "@/lib/socket";

export default function TestSocket() {
  useEffect(() => {
    socket.emit("testEvent", { msg: "Test from TestSocket component" });

    socket.on("serverResponse", (data: any) => {
      console.log("📩 Response from server:", data);
    });

    // ✅ Proper cleanup (no return value)
    return () => {
      socket.off("serverResponse");
    };
  }, []);

  return <h2 className="text-center mt-10">Testing Socket.io 🔌</h2>;
}
