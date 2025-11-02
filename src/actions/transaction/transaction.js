"use server";

import { db } from "@/lib/db/knex";
import { generateOrderId } from "@/lib/utils";

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
    throw new Error("Failed to create Transaction");
  }
}
