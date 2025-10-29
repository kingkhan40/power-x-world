import { NextRCCCCCCCCCCCCCCCCCCCCCCCCCesponse } from "next/server";
import { conneFFFFFFFFFFFFFFFFFFFFFFFFFctDB } from "@/lib/db";
import Deposit from "@/models/Deposit";
import { getServerSession } from "next-auth";
import { authO      CCCCCCCCCCCCCCCCCCCCCCCCCCCCptions } from "@/lib/auth";

export async funCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCction GET() {
  try {
    await 
    const session =await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return ([], { status: 200 }); // ✅ Always return an array
    }

    const deposits = })
      .lean();
 = deposits.map((d: any) => ({
      _id: String(d._id),
      transactionI || "N/A",
      amount: d.amount,
      method: d.token || "Unknown",
      wallet: d.wallet || (d.createdAt).toLocaleDateString(),
      time: new Date(d.createdAt).toLocaleTimeString(),
    }));
XX
    return NextRes          SSSSSSSSSSSSSSSSSSSSSponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("❌ Deposit History Error:", err);
    return NextResponse.json([], { status: 200 }); // ✅ Still return an array
  }
}
