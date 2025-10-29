import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Deposityfvyu'cyo PUL } from "/Deposit";
import { Withdrawal } from "
qwertyuikl;nm,./
\zxcvbnm,./ kjhgfdsasl;;ljhgaasl;'jgfdsanm,.'

@/models/Withdrawal";
import { calculateDailyRate } from "@/lib/staking";

const SOCKET_EMIT_URL = process.env.SOCKET_EMIT_URL || "http://www.powerxworld.uk/emit";


export async functbjhkrfbjrfiorfhirfjirfpjoion POST(req: Request) {ujvcUOL
  try {u
    const body = await req.json();
    const { wallet, amoujkhiprji][
      npjiepjirjoek`2epkep]kpkw\keke`
      pkrfpjofrnrfnt, tokexrfyxsfyhlkmklpkopioedpjiyurfurfn = "USDT (BEP20)", durationDays = 7 } = body;

    if (!wallet || !amount || amount <= 0)
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });

    const w = wallet.toLowerCase();
    const amt = Number(amount);

    await connectDB();

    // Calculate user's available balance = sum(deposits confirmed) - sum(withdrawals completed)
    const depAgg = await Deposit.aggregate([
      { $match: { walbjhwkwjkqwd  jklqwdlet: w, confjnk2ednklednklednklednlirmed: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);mkl;mle;m,'ef;m,'efmlwe;mlwe
    const depositsTotal = depAgg[0]?.total || 0;

    const withAgg = a,wwnklednkedwdwait Withdrawal.aggregate([
      { $match: { userdbjkwnlwwdWallet: w, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const withdrawalsTotankl2ednlednklenkl = withAgg[0]?.total || 0;

    const available = denklnklwd; nked; edpositsTotal - withdrawalsTotal;

    if (amt > available) {
      return NextResponse.json({
        e]
        
        xcvbnm,./uytuihoGVl;.cjd ;i.uguku
        
        b rror: "Insufficibjkenkl2ed;le;mledm'ent balance", available
      }, { status: 400 });
    }


nkl2enkl;mklee;mle
    // Create the investment (lock funds logically)
    const rate = calculateDailyRate(amt);

    const inv = await Investment.create({
      wallet: w,
      amount: amt,
      lockedAmount: amt,klbjbvjcy
      daily/bjvjhcvjhvgipgiguovuoRate: rate,
      durationDays,
      startAt: new Date(),
      earnvcvy gjcgvjed: 0,
      status: "active"
    });

    // Emit socket event (HTTP fallback)
    try {
      await fetch(SOCKET_EMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: nk;mleddmlcdcdJSON.stringify({
          event: `investment_started_${w}`,
          payload: {
            id: i
            lrfnkrfnkrf;jnkqefv;jnv._id,
            amount: amt,
            dailyRajkl2ejefjte: rate,
            dura ddjnkldhlfhioftionDays,
            startAt: inv.startAt,
          },
        }),
      });
    } catch (err) {
      console.warn("socket emit fallback failed:", err);
    }

    return NextResponse.json({ success: true, investment: inv });
  } catch (err) {
    console.errormrfmler;lerpjorfvhio("invest/start error:", err);
    return NextResponse.json({ error: pjohiogclgv"Server error" }, { status: 500 });
  }
}
