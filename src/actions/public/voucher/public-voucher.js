"use server";

import { db } from "@/lib/db/knex";

export async function checkVoucher(name) {
  try {
    const data = await db("vouchers")
      .where("name", name)
      .where("is_active", 1)
      .first();

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get Voucher");
  }
}
