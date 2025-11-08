"use server";

import { db } from "@/lib/db/knex";
import { generateOrderId } from "@/lib/utils";
import * as gamepoint from "../provider/gamepoint";
import * as moogold from "../provider/moogold";
import * as digiflash from "../provider/digiflash";

export async function createTransaction(data) {
  try {
    const orderId = generateOrderId();
    console.log("data", data);

    const dataTransaction = {
      user_id: data.userId,
      product_in_provider_id: data.selectedPackage.id_product_in_provider,
      date: new Date().toISOString(),
      metode: data.selectedPaymentMethod.payment_method,
      payment_progress: "Processing",
      order_id: orderId, // -> harus di buat sendiri
      price: data.pricing.base_price,
      using_member: data.using_member ?? null,
      total_amount: data.pricing.total,
      voucher_id: data.voucher ? data.voucher.voucher_id : null,
      voucher: data.voucher ? data.voucher.voucher : null,
      is_active: 1,
      data_input_user: JSON.stringify(data),
    };
    const values = Object.values(data.userInputs);
    console.log("user inputs", values);

    const productInProvider = await db("product_in_providers")
      .leftJoin(
        "provider_products as pp",
        "product_in_providers.product_provider_id",
        "pp.id"
      )
      .leftJoin("products as p", "product_in_providers.product_id", "p.id")
      .leftJoin("type_products as tp", "p.type_product_id", "tp.id")
      .where(
        "product_in_providers.id",
        data.selectedPackage.id_product_in_provider
      )
      .select(
        "product_in_providers.*",
        "pp.name as provider_name",
        "tp.name as type_product_name"
      )
      .first();

    // Cek saldo user jika menggunakan saldo
    if (data.selectedPaymentMethod.payment_method === "saldo" && data.userId) {
      const user = await db("user").where("id", data.userId).first();
      if (Number(user.saldo) < Number(data.pricing.total)) {
        return { success: false, message: "Saldo tidak cukup" };
      }
      const saldoUser = Number(user.saldo) - Number(data.pricing.total);

      // Order ke provider
      if (productInProvider.type_product_name === "Game") {
        if (productInProvider.provider_name === "GAMEPOINT") {
          console.log("gamepoint");
          console.log("values1", values[0]);
          console.log("values2", values[1]);
          const result = await gamepoint.order(
            orderId,
            data.selectedPackage.product_id_from_provider,
            values[0],
            values[1] ?? null
          );
          console.log("result gamepoint", result);
        } else if (productInProvider.provider_name === "MOOGOLD") {
          console.log("moogold");
          const result = await moogold.order(
            data.selectedPackage.product_id_from_provider,
            values[0],
            values[1] ?? null
          );
          console.log("result moogold", result);
        } else if (productInProvider.provider_name === "DIGIFLASH") {
          console.log("digiflash");
          const result = await digiflash.order(
            values[0],
            values[1] ?? null,
            data.selectedPackage.product_id_from_provider,
            orderId
          );
          console.log("result digiflash", result);
        }
      }
    }

    console.log("productInProvider", productInProvider);

    console.log("dataTransaction", dataTransaction);

    // kalo using member dan methodnya saldo maka di buat sendiri transaksinya dan sukses

    // kalo using member dan e payment maka buat transaksinya dulu dan ambil data dari duitku

    // kalo user biasa dan e payment maka buat transaksinya dulu dan ambil data dari duitku

    // const [id] = await db("transactions").insert({
    //   user_id: data.user_id,
    //   product_in_provider_id: data.product_in_provider_id,
    //   date: data.date,
    //   metode: data.metode,
    //   payment_progress: data.payment_progress,
    //   order_id: data.order_id,
    //   price: data.price,
    //   va_number: data.va_number,
    //   using_member: data.using_member,
    //   fee_pg: data.fee_pg,
    //   total_amount: data.total_amount,
    //   voucher_id: data.voucher_id,
    //   voucher: data.voucher,
    //   is_active: data.is_active,
    //   created_at: data.created_at,
    //   updated_at: data.updated_at,
    //   pg_order_id: data.pg_order_id,
    //   provider_order_id: data.provider_order_id,
    //   qr_string: data.qr_string,
    //   url_payment: data.url_payment,
    //   data_input_user: data.data_input_user,
    // });
    // return { success: true, id };
    return { success: true, data };
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to create Transaction");
  }
}
