import { callbackPayment } from "@/actions/transaction/transaction";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Duitku mengirim via x-www-form-urlencoded
    const raw = await req.text();
    const params = new URLSearchParams(raw);

    // Data dari Payment Gateway (Duitku)
    const data = Object.fromEntries(params.entries());

    console.log("Callback data:", data);
    const callback = await callbackPayment(data)
    console.log("callback", callback);
    
    // 👉 Pengecekan hasil callback dari action
    if (callback.success === true) {
      // Notifikasi PG berhasil diproses
      return NextResponse.json(
        { success: true, message: "Transaction processed successfully", data },
        { status: 200 }
      );
    } else {
      // Notifikasi PG diterima, namun gagal diproses secara internal (e.g., transaction not found)
      // Mengembalikan status 200 ke PG (acknowledge), tapi body-nya success: false
      return NextResponse.json(
        { 
          success: false, 
          message: callback.message || "Callback received, but transaction failed internally", 
          data 
        },
        { status: 200 }
      );
    }

  } catch (e) {
    console.error("Callback error:", e);

    // Jika terjadi error tak terduga (misalnya Knex error, JSON parse error)
    // Mengembalikan status 500
    return NextResponse.json(
      { success: false, message: "Internal error during callback processing" },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ message: "Callback endpoint OK" });
}