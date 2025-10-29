
// 👇 Add `: Request` type annotation
export async function GET(req: Request) {
  try {
    await connectDB();

    const email = searchParams.get("email");

      return NextResponse.json({ success: false, message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({
      success: true,
      balance: user.wallet || 0,
    });
  } catch (error) {
    console.error("Balance Fetch Error:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
