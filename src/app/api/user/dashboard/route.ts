import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/models/User";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ message: "UserId required" }, { status: 400 });

  // Populate teamMembers
  const user = await User.findById(userId).populate("teamMembers") as IUser & { teamMembers: IUser[] };
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Filter active users safely
  const activeUsers = user.teamMembers.filter(
    (member: IUser) => (member.investments?.[0]?.amount ?? 0) >= 50
  ).length;

  return NextResponse.json({
    level: user.level,
    totalCommission: user.wallet,
    totalTeam: user.totalTeam,
    activeUsers
  });
}
