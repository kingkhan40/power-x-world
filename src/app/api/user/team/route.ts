import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId)
      return NextResponse.json({ message: "UserId required" }, { status: 400 });

    // ✅ Fix TypeScript complaint by double casting
    const user = (await User.findById(userId).populate("teamMembers")) as unknown as
      IUser & { teamMembers: IUser[] };

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    // 🔹 Filter active team members
    const activeMembers = user.teamMembers.filter(
      (m: IUser) => (m.investments?.[0]?.amount ?? 0) >= 50
    );

    // 🔹 Map team data
    const teamData = activeMembers.map((member: IUser) => ({
      name: member.userName,
      email: member.userEmail,
      deposit: member.investments?.[0]?.amount ?? 0,
      status: (member.investments?.[0]?.amount ?? 0) >= 50 ? "active" : "inactive",
    }));

    return NextResponse.json({ team: teamData });
  } catch (error) {
    console.error("❌ Error fetching team:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
