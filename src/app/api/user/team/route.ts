import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/models/User"; // Make sure IUser is exported from your User model

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ message: "UserId required" }, { status: 400 });

  // Populate teamMembers and cast type
  const user = await User.findById(userId).populate("teamMembers") as IUser & { teamMembers: IUser[] };
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Filter active members safely
  const activeMembers = user.teamMembers.filter(
    (m: IUser) => (m.investments?.[0]?.amount ?? 0) >= 50
  );

  // Map team data
  const teamData = activeMembers.map((member: IUser) => ({
    name: member.name,
    email: member.email,
    deposit: member.investments?.[0]?.amount ?? 0,
    status: (member.investments?.[0]?.amount ?? 0) >= 50 ? "active" : "inactive",
  }));

  return NextResponse.json({ team: teamData });
}
