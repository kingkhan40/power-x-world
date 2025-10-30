import cron from "node-cron";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Stake from "@/models/Stake";
import User from "@/models/User";

(async () => {
  console.log("🕒 Cron job started...");

  await connectDB();

  // 🕐 Run daily at midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Checking for completed stakes...");

    try {
      const activeStakes = await Stake.find({ status: "active" });

      if (activeStakes.length === 0) {
        console.log("⚠️ No active stakes found.");
        return;
      }

      for (const stake of activeStakes) {
        // 🧮 Check if user has earned 3x their investment
        if (stake.totalReward >= stake.amount * 3) {
          stake.status = "completed";
          stake.endDate = new Date();
          await stake.save();

          // ✅ Send totalReward to user wallet
          const user = await User.findById(stake.userId);
          if (user) {
            user.wallet = (user.wallet || 0) + stake.totalReward;
            await user.save();
          }

          console.log(
            `💰 Stake completed for user ${stake.userId}: ${stake.totalReward}`
          );
        }
      }

      console.log("✅ Cron cycle finished successfully!");
    } catch (err) {
      console.error("❌ Cron execution failed:", err);
    }
  });

  console.log("✅ Cron scheduler initialized! Waiting for next trigger...");
})();
