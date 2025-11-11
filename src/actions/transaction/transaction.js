"use server";

import { db } from "@/lib/db/knex";
import { generateOrderId } from "@/lib/utils";
import * as gamepoint from "../provider/gamepoint";
import * as moogold from "../provider/moogold";
import * as digiflash from "../provider/digiflash";
import { success } from "zod";

export async function createTransaction(data) {
  try {
    const orderId = generateOrderId();
    console.log("data", data);

    const dataTransaction = {
      user_id: data.userId,
      product_in_provider_id: data.selectedPackage.id_product_in_provider,
      date: db.fn.now(),
      metode: data.selectedPaymentMethod.payment_method,
      payment_progress: "Processing",
      order_id: orderId,
      price: data.pricing.base_price,
      using_member: data.using_member ?? null,
      total_amount: data.pricing.total,
      voucher_id: data.voucher ? data.voucher.voucher_id : null,
      voucher: data.voucher ? data.voucher.voucher : null,
      is_active: 1,
      data_input_user: JSON.stringify(data),
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    };

    await db("transactions").insert(dataTransaction);

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

    // ✅ Cek saldo user jika menggunakan saldo
    if (data.selectedPaymentMethod.payment_method === "saldo" && data.userId) {
      const user = await db("user").where("id", data.userId).first();
      if (Number(user.saldo) < Number(data.pricing.total)) {
        return { success: false, message: "Saldo tidak cukup" };
      }

      const saldoUser = Number(user.saldo) - Number(data.pricing.total);

      // ✅ Order ke provider
      if (productInProvider.type_product_name === "Game") {
        const response = await TransactionForProvider(productInProvider, values, data, orderId);
        console.log("response", response);

        if (response.success === true) {
          // ✅ Update saldo user
          try {
            await db("user")
              .where("id", data.userId)
              .update({ saldo: saldoUser });
          } catch (e) {
            console.error("Gagal update saldo:", e);
          }

          // ✅ Update voucher jika ada
          try {
            if (dataTransaction.voucher_id) {
              await db("vouchers")
                .where("id", dataTransaction.voucher_id)
                .update({ total_use: db.raw("COALESCE(total_use, 0) + 1") });
            }
          } catch (e) {
            console.error("Gagal update voucher:", e);
          }

          // ✅ Update transaksi jadi sukses
          await db("transactions")
            .where("order_id", orderId)
            .update({
              payment_progress: "Success",
              updated_at: db.fn.now(),
            });

          return {
            success: true,
            message: "Transaksi Berhasil",
            order_id: orderId,
          };
        } else {
          return {
            success: false,
            message: "Gagal Transaksi ke Provider",
            order_id: null,
          };
        }
      }
    }

    return { success: true, data };
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to create Transaction");
  }
}


async function TransactionForProvider(productInProvider, values, data, orderId) {
  if (productInProvider.provider_name === "GAMEPOINT") {
    const result = await gamepoint.order(
      orderId,
      data.selectedPackage.product_id_from_provider,
      values[0],
      values[1] ?? null
    );

    if (result.status === false) {
      return {
        success: false,
        message: "Failed to create Transaction Error Provider",
        data: null
      };
    }

  } else if (productInProvider.provider_name === "MOOGOLD") {
    const result = await moogold.order(
      data.selectedPackage.product_id_from_provider,
      values[0],
      values[1] ?? null
    );

  } else if (productInProvider.provider_name === "DIGIFLASH") {
    const result = await digiflash.order(
      values[0],
      values[1] ?? null,
      data.selectedPackage.product_id_from_provider,
      orderId
    );

    if (result.data.status === "Pending" || result.data.status === "Sukses") {
      return {
        success: true,
        message: "Success Transaction Provider",
        data: result.data
      };
    } else {
      return {
        success: false,
        message: "Failed to create Transaction Error Provider",
        data: null
      };
    }
  }
}


export async function getTransactionByOrderID(order_id) {
  try {
    const data = await db("transactions").whereILike("order_id", order_id).first();

    return data;
  } catch (error) {
    throw new Error("Failed to get Transaction");
  }
}