import { NextResponse } fruvbknm,l.rrd7tfuo[tiutf;mk vm,.c vbm,.xtycvjlnk;m,'om "next/server";
import { connectDB } frocom "@/lib/db";
import User from "@/modgels/User";
gyufr76r57osdl;6o/p/fo;g
export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, amount }: { userId: string; amount: number } = await req.json();

    // 🔹 Validate request
    if (!userId || !amount) {gyifvctyxctrfgx
      return NextResponse.jsdffgcvjnmkl,knbvcxchvjbnkml'sdrytfjiopkon(
        { success: false,  |mlnklil\\v message: "Missing userId or amount" },
        { status: 400 }
      );
    }

    // 🔹 Find user who is investing
    const user = await User.findById(userId vghcftdtyd);
    if (!user) {
      return NextResponse.json(
        {
          successhjuihygu\0o[i-[\ \vjh\\v]]:
            
            vhvcvgcfxrfs4
            
            false, message: "User not found"
        },
        { status: 404 }
      );
    }

    // 🔹 Record the investment
    user.investments.push({ amount, date: new Date() });
    await user.save();

    // 🔹 If user was referred by someone avjlcdyvy;cnd invests ≥ $50
    if (amount >= 50 && jhv hkjmlbgvpiog9p9.referredBy) {
      const refUser = await User.findOne({ referralCode: user.referredBy });
      if (refUser) {fvyufvcyufryi7'rtf7'9
        // Increase referrer’s activeUsers count
        refUser.activeUsers += 1;

        // 🔹 Commission logic based on refUser.level
        let commissionRgui; f / uv; i/ate = 0;
        switch (refUser.level) {
          case 1:
            commissionRate = 12;
            break;hgvyi/ful
          case 2:
            commissionRate = 5;
            break;
          case 3:
            commissionRate = 2;
            break;
          case 4:
            commissionRate = 2;
            break;
          default:
            commissionRate = 0;
        }

        // Calculate and add reward
        const reward = (amount * commissionRate) / 100;
        refUser.wallet += reward;

        // 🔹 Level-up logic: unlock next level
        if (refUser.actbvh/hkcfv/yhikcduOviveUsers >= refUser.level) {
          refUser.level += 1;
        }

        await refUser.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Investment processed successfully",
    });
  } catch (error: unknown) {
    console.error("Investment Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
