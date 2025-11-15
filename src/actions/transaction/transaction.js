"use server";

import { db } from "@/lib/db/knex";
import { generateOrderId } from "@/lib/utils";
import * as gamepoint from "../provider/gamepoint";
import * as moogold from "../provider/moogold";
import * as digiflash from "../provider/digiflash";
import * as duitku from "../payment-getaway/duitku"
import { success } from "zod";

  // export async function createTransaction(data) {
  //   try {
  //     const orderId = generateOrderId();
  //     console.log("data", data);

  //     const dataTransaction = {
  //       user_id: data.userId,
  //       product_in_provider_id: data.selectedPackage.id_product_in_provider,
  //       date: db.fn.now(),
  //       metode: data.selectedPaymentMethod.payment_method,
  //       payment_progress: "Processing",
  //       order_id: orderId,
  //       price: data.pricing.base_price,
  //       using_member: data.using_member ?? null,
  //       total_amount: data.pricing.total,
  //       voucher_id: data.voucher ? data.voucher.voucher_id : null,
  //       voucher: data.voucher ? data.voucher.voucher : null,
  //       is_active: 1,
  //       data_input_user: JSON.stringify(data),
  //       created_at: db.fn.now(),
  //       updated_at: db.fn.now(),
  //     };

  //     await db("transactions").insert(dataTransaction);

  //     const values = Object.values(data.userInputs);
  //     console.log("user inputs", values);

  //     const productInProvider = await db("product_in_providers")
  //       .leftJoin(
  //         "provider_products as pp",
  //         "product_in_providers.product_provider_id",
  //         "pp.id"
  //       )
  //       .leftJoin("products as p", "product_in_providers.product_id", "p.id")
  //       .leftJoin("type_products as tp", "p.type_product_id", "tp.id")
  //       .where(
  //         "product_in_providers.id",
  //         data.selectedPackage.id_product_in_provider
  //       )
  //       .select(
  //         "product_in_providers.*",
  //         "pp.name as provider_name",
  //         "tp.name as type_product_name"
  //       )
  //       .first();

  //     // ✅ Cek saldo user jika menggunakan saldo
  //     if (data.selectedPaymentMethod.payment_method === "saldo" && data.userId) {
  //       const user = await db("user").where("id", data.userId).first();
  //       if (Number(user.saldo) < Number(data.pricing.total)) {
  //         return { success: false, message: "Saldo tidak cukup" };
  //       }

  //       const saldoUser = Number(user.saldo) - Number(data.pricing.total);

  //       // ✅ Order ke provider
  //       if (productInProvider.type_product_name === "Game") {
  //         const response = await TransactionForProvider(productInProvider, values, data, orderId);
  //         console.log("response", response);

  //         if (response.success === true) {
  //           // ✅ Update saldo user
  //           try {
  //             await db("user")
  //               .where("id", data.userId)
  //               .update({ saldo: saldoUser });
  //           } catch (e) {
  //             console.error("Gagal update saldo:", e);
  //           }

  //           // ✅ Update voucher jika ada
  //           try {
  //             if (dataTransaction.voucher_id) {
  //               await db("vouchers")
  //                 .where("id", dataTransaction.voucher_id)
  //                 .update({ total_use: db.raw("COALESCE(total_use, 0) + 1") });
  //             }
  //           } catch (e) {
  //             console.error("Gagal update voucher:", e);
  //           }

  //           // ✅ Update transaksi jadi sukses
  //           await db("transactions")
  //             .where("order_id", orderId)
  //             .update({
  //               payment_progress: "Success",
  //               updated_at: db.fn.now(),
  //             });

  //           return {
  //             success: true,
  //             message: "Transaksi Berhasil",
  //             order_id: orderId,
  //           };
  //         } else {
  //           return {
  //             success: false,
  //             message: "Gagal Transaksi ke Provider",
  //             order_id: null,
  //           };
  //         }
  //       }
  //     }

  //     return { success: true, data };
  //   } catch (error) {
  //     console.log("error", error);
  //     throw new Error("Failed to create Transaction");
  //   }
// }
  

// export async function createTransaction(data) {
//   const trx = await db.transaction(); // mulai transaksi

//   try {
//     const orderId = generateOrderId();
//     const now = db.fn.now();

//     const dataTransaction = {
//       user_id: data.userId,
//       product_in_provider_id: data.selectedPackage.id_product_in_provider,
//       date: now,
//       metode: data.selectedPaymentMethod.payment_method,
//       payment_progress: "Processing",
//       order_id: orderId,
//       price: data.pricing.base_price,
//       using_member: data.using_member ?? null,
//       total_amount: data.pricing.total,
//       voucher_id: data.voucher ? data.voucher.voucher_id : null,
//       voucher: data.voucher ? data.voucher.voucher : null,
//       is_active: 1,
//       data_input_user: JSON.stringify(data),
//       created_at: now,
//       updated_at: now,
//     };

//     // ✅ Simpan transaksi awal
//     const [transactionId] = await trx("transactions").insert(dataTransaction);

//     // Ambil user inputs aman
//     const values = Object.values(data.userInputs ?? {});

//     // ✅ Ambil produk dan provider
//     const productInProvider = await trx("product_in_providers")
//       .leftJoin("provider_products as pp", "product_in_providers.product_provider_id", "pp.id")
//       .leftJoin("products as p", "product_in_providers.product_id", "p.id")
//       .leftJoin("type_products as tp", "p.type_product_id", "tp.id")
//       .where("product_in_providers.id", data.selectedPackage.id_product_in_provider)
//       .select(
//         "product_in_providers.*",
//         "pp.name as provider_name",
//         "tp.name as type_product_name"
//       )
//       .first();

//     // ✅ Kalau pakai voucher, cek kuota dulu secara atomik
//     if (dataTransaction.voucher_id) {
//       const updated = await trx("vouchers")
//         .where("id", dataTransaction.voucher_id)
//         .whereRaw("COALESCE(total_use, 0) < COALESCE(kuota, 0)")
//         .update({ total_use: db.raw("COALESCE(total_use, 0) + 1") });

//       if (updated === 0) {
//         await trx.rollback();
//         return { success: false, message: "Kuota voucher sudah habis" };
//       }
//     }

//     // ✅ Kalau bayar pakai saldo
//     if (data.selectedPaymentMethod.payment_method === "saldo" && data.userId) {
//       const user = await trx("user").where("id", data.userId).forUpdate().first();

//       if (!user) {
//         await trx.rollback();
//         return { success: false, message: "User tidak ditemukan" };
//       }

//       if (Number(user.saldo) < Number(data.pricing.total)) {
//         await trx.rollback();
//         return { success: false, message: "Saldo tidak cukup" };
//       }

//       // Kurangi saldo user
//       const saldoBaru = Number(user.saldo) - Number(data.pricing.total);
//       await trx("user").where("id", data.userId).update({ saldo: saldoBaru });
//     }

//     // ✅ Jalankan transaksi ke provider (misalnya Digiflazz)
//     let providerResponse = { success: false };
//     if (productInProvider.type_product_name === "Game") {
//       providerResponse = await TransactionForProvider(productInProvider, values, data, orderId);
//     } else if (productInProvider.type_product_name === "Pulsa" || productInProvider.type_product_name === "Data") {
//       providerResponse = await TransactionForProvider(productInProvider, values, data, orderId);
//     }

//     // ✅ Kalau provider berhasil
//     if (providerResponse.success === true) {
//       await trx("transactions")
//         .where("order_id", orderId)
//         .update({
//           payment_progress: "Success",
//           updated_at: db.fn.now(),
//         });

//       await trx.commit();
//       return {
//         success: true,
//         message: "Transaksi Berhasil",
//         order_id: orderId,
//       };
//     }

//     // ❌ Kalau gagal ke provider, rollback semua
//     await trx("transactions")
//       .where("order_id", orderId)
//       .update({
//         payment_progress: "Failed",
//         updated_at: db.fn.now(),
//       });

//     await trx.rollback();
//     return {
//       success: false,
//       message: "Gagal Transaksi ke Provider",
//       order_id: null,
//     };
//   } catch (error) {
//     console.error("Error createTransaction:", error);
//     await trx.rollback();
//     return { success: false, message: "Terjadi kesalahan sistem" };
//   }
// }


export async function createTransaction(data) {
  // Gunakan database transaction untuk atomicity
  const trx = await db.transaction();

  try {
    const orderId = generateOrderId();
    console.log("data", data);

    // ========================================
    // 1. VALIDASI AWAL DENGAN HELPER (Quick Fail)
    // ========================================
    
    // ✅ Cek voucher availability menggunakan helper
    // Helper ini melakukan pengecekan dasar tanpa lock (cepat untuk reject request invalid)
    if (data.voucher) {
      const voucherCheck = await checkVoucherAvailability(data.voucher.voucher_id);
      
      if (!voucherCheck.available) {
        await trx.rollback();
        return { 
          success: false, 
          message: voucherCheck.message 
        };
      }
      
      // ✅ Informasikan sisa voucher ke user (optional)
      console.log(`Voucher ${voucherCheck.voucher.name} tersisa: ${voucherCheck.remaining} dari ${voucherCheck.voucher.kuota}`);
    }

    // ✅ Validasi user saldo jika pakai saldo
    if (data.selectedPaymentMethod.payment_method === "saldo" && data.userId) {
      const user = await trx("user")
        .where("id", data.userId)
        .first();

      if (!user) {
        await trx.rollback();
        return { success: false, message: "User tidak ditemukan" };
      }

      if (Number(user.saldo) < Number(data.pricing.total)) {
        await trx.rollback();
        return { success: false, message: "Saldo tidak cukup" };
      }
    }

    // ========================================
    // 2. LOCK RESOURCES (Prevent Race Condition)
    // ========================================
    
    let voucherLocked = null;
    
    // ✅ LOCK VOUCHER ROW - Ini yang mencegah race condition
    // Setelah helper check di atas (quick validation), sekarang kita LOCK voucher
    // untuk memastikan tidak ada transaksi lain yang bisa akses voucher ini
    // sampai transaksi kita selesai (commit/rollback)
    if (data.voucher) {
      voucherLocked = await trx("vouchers")
        .where("id", data.voucher.voucher_id)
        .forUpdate() // ✅ SELECT FOR UPDATE - lock row sampai commit/rollback
        .first();

      // ⚠️ PENTING: Validasi ulang setelah lock!
      // Karena mungkin ada transaksi lain yang sudah update voucher
      // antara helper check (step 1) dan lock ini (step 2)
      
      // Convert varchar to number untuk comparison
      const totalUse = Number(voucherLocked.total_use) || 0;
      const kuota = Number(voucherLocked.kuota) || 0;
      
      // Cek kuota setelah lock (DOUBLE CHECK - ini yang crucial)
      if (totalUse >= kuota) {
        await trx.rollback();
        return { 
          success: false, 
          message: "Voucher sudah mencapai batas penggunaan maksimal" 
        };
      }

      // Cek status active setelah lock
      if (voucherLocked.is_active !== 1) {
        await trx.rollback();
        return { 
          success: false, 
          message: "Voucher tidak aktif" 
        };
      }
    }

    // ✅ LOCK USER ROW jika pakai saldo
    let userLocked = null;
    if (data.selectedPaymentMethod.payment_method === "saldo" && data.userId) {
      userLocked = await trx("user")
        .where("id", data.userId)
        .forUpdate() // ✅ Lock user row untuk prevent concurrent saldo updates
        .first();

      // Double check saldo setelah lock
      if (Number(userLocked.saldo) < Number(data.pricing.total)) {
        await trx.rollback();
        return { success: false, message: "Saldo tidak cukup" };
      }
    }

    // ========================================
    // 3. INSERT TRANSAKSI
    // ========================================
    
    const dataTransaction = {
      user_id: data.userId,
      product_in_provider_id: data.selectedPackage.id_product_in_provider,
      date: trx.fn.now(),
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
      created_at: trx.fn.now(),
      updated_at: trx.fn.now(),
    };

    console.log("dataTransaction", dataTransaction);
    

    await trx("transactions").insert(dataTransaction);

    // ========================================
    // 4. GET PRODUCT INFO
    // ========================================
    
    const values = Object.values(data.userInputs);
    console.log("user inputs", values);

    const productInProvider = await trx("product_in_providers")
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

    if (!productInProvider) {
      await trx.rollback();
      return { success: false, message: "Produk tidak ditemukan" };
    }

    // ========================================
    // 5. PROSES PAYMENT & PROVIDER
    // ========================================
    
    if (data.selectedPaymentMethod.payment_method === "saldo" && data.userId) {
      
      // Order ke provider
      if (productInProvider.type_product_name === "Game") {
        const response = await TransactionForProvider(
          productInProvider, 
          values, 
          data, 
          orderId
        );
        
        console.log("response", response);

        if (response.success === true) {
          
          // ========================================
          // 6. UPDATE SEMUA RESOURCE (Atomic Operations)
          // ========================================
          
          // ✅ UPDATE SALDO USER dengan atomic decrement
          // Menggunakan decrement() dan WHERE condition untuk safety
          // Jika saldo < total (race condition dengan withdrawal lain), update gagal
          const saldoUpdated = await trx("user")
            .where("id", data.userId)
            .where("saldo", ">=", data.pricing.total) // ✅ Safety check di database level
            .decrement("saldo", data.pricing.total);

          // Cek apakah update berhasil (affected rows > 0)
          if (saldoUpdated === 0) {
            // Update gagal karena saldo tidak cukup (kemungkinan ada transaksi lain)
            await trx.rollback();
            return { 
              success: false, 
              message: "Gagal memotong saldo (saldo tidak cukup)" 
            };
          }

          // ✅ UPDATE VOUCHER dengan atomic increment + WHERE condition
          // Ini adalah TRIPLE PROTECTION untuk voucher:
          // 1. Helper check (step 1) - quick validation
          // 2. Lock + double check (step 2) - prevent concurrent access
          // 3. Atomic update dengan WHERE (step 6) - final safety net di database
          if (dataTransaction.voucher_id) {
            // ⚠️ PENTING: Karena kuota & total_use adalah VARCHAR, kita harus hati-hati
            // Gunakan CAST untuk memastikan comparison numerik yang benar
            // CAST(...) untuk ensure hasil tetap string (sesuai tipe kolom VARCHAR)
            const voucherUpdated = await trx("vouchers")
              .where("id", dataTransaction.voucher_id)
              .whereRaw("CAST(total_use AS UNSIGNED) < CAST(kuota AS UNSIGNED)") // ✅ Atomic check di database
              .update({
                // Convert ke number, tambah 1, convert kembali ke string
                total_use: trx.raw("CAST(CAST(total_use AS UNSIGNED) + 1 AS CHAR)"),
                updated_at: trx.fn.now()
              });

            // Cek apakah update berhasil
            if (voucherUpdated === 0) {
              // Voucher penuh (meskipun sudah di-lock, ini sebagai safety net terakhir)
              await trx.rollback();
              return { 
                success: false, 
                message: "Voucher sudah mencapai batas penggunaan" 
              };
            }
          }

          // ✅ UPDATE STATUS TRANSAKSI jadi Success
          await trx("transactions")
            .where("order_id", orderId)
            .update({
              payment_progress: "Success",
              provider_order_id: response.provider_order_id,
              updated_at: trx.fn.now(),
            });

          // ========================================
          // 7. COMMIT TRANSACTION (Simpan semua perubahan)
          // ========================================
          // Semua perubahan (saldo, voucher, transaksi) disimpan secara atomic
          // Jika salah satu gagal di atas, semua akan di-rollback
          await trx.commit();

          return {
            success: true,
            message: "Transaksi Berhasil",
            order_id: orderId,
          };

        } else {
          // ✅ PROVIDER GAGAL - Update transaksi jadi Failed tapi tetap simpan
          await trx("transactions")
            .where("order_id", orderId)
            .update({
              payment_progress: "Failed",
              provider_order_id: response.provider_order_id,
              updated_at: trx.fn.now(),
            });

          // Commit transaksi (untuk record history) tapi status Failed
          // Saldo dan voucher tidak dikurangi karena belum sampai step 6
          await trx.commit();

          return {
            success: false,
            message: response.message || "Gagal Transaksi ke Provider",
            order_id: orderId,
          };
        }
      } else {
        await trx.rollback();
        return {
          success: false,
          message: "Tipe produk tidak didukung",
        };
      }
    } else {
      // Metode pembayaran lain (misalnya payment gateway)
      try {
        const responseDuitku = await duitku.requestInquiry(
          10000, 
          data.selectedPaymentMethod.id, 
          process.env.PHONE_NUMBER, 
          process.env.EMAIL
        );

        console.log("responseDuitku", responseDuitku);

        // Pastikan response valid
        if (!responseDuitku || !responseDuitku.reference) {
          await trx.rollback();
          return { 
            success: false, 
            message: "Gagal membuat pembayaran, silakan coba lagi" 
          };
        }

        // Update transaction dengan data dari Duitku
        await trx("transactions")
            .where("order_id", orderId)
            .update({
              pg_order_id: responseDuitku.reference,
              url_payment: responseDuitku.paymentUrl,
              va_number: responseDuitku.vaNumber || null,
              qr_string: responseDuitku.qrString || null,
              payment_progress: "pending",
              updated_at: trx.fn.now(),
            });

        // Transaksi dibuat dengan status pending, menunggu callback payment
        await trx.commit();
        
        return { 
          success: true, 
          message: "Transaksi berhasil dibuat, silakan lakukan pembayaran",
          order_id: orderId,
          payment_url: responseDuitku.paymentUrl,
          va_number: responseDuitku.vaNumber,
          qr_string: responseDuitku.qrString,
          reference: responseDuitku.reference,
        };

      } catch (error) {
        console.error("Duitku Error:", error);
        await trx.rollback();
        
        return { 
          success: false, 
          message: error.message || "Gagal membuat pembayaran",
        };
      }
    }

  } catch (error) {
    // ✅ ERROR HANDLER - Rollback semua perubahan jika ada error
    await trx.rollback();
    
    console.error("Transaction error:", error);
    
    return {
      success: false,
      message: error.message || "Gagal memproses transaksi",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined
    };
  }
}

// ========================================
// HELPER: Cek status voucher (Pre-validation)
// ========================================
/**
 * Helper function untuk cek voucher availability TANPA lock
 * Digunakan untuk quick validation sebelum masuk ke transaction lock
 * 
 * ⚠️ CATATAN PENTING:
 * - Helper ini TIDAK mencegah race condition
 * - Helper ini hanya untuk QUICK FAIL (reject request invalid lebih cepat)
 * - Masih perlu LOCK + DOUBLE CHECK di dalam transaction untuk safety
 * 
 * Kenapa perlu helper + lock?
 * 1. Helper (step 1): Cepat reject 99% request yang invalid (hemat resource)
 * 2. Lock (step 2): Prevent race condition untuk 1% request yang valid dan concurrent
 * 
 * Analogi:
 * - Helper = Security guard di depan (check tiket basic)
 * - Lock = Pintu masuk dengan turnstile (one by one, prevent double entry)
 */
export async function checkVoucherAvailability(voucherId) {
  try {
    // Query tanpa lock (read-only check)
    const voucher = await db("vouchers")
      .where("id", voucherId)
      .where("is_active", 1)
      .first();

    if (!voucher) {
      return { 
        available: false, 
        message: "Voucher tidak ditemukan" 
      };
    }

    // Convert varchar to number untuk comparison
    const totalUse = Number(voucher.total_use) || 0;
    const kuota = Number(voucher.kuota) || 0;

    // Cek kuota (ini hanya check awal, bukan final decision)
    if (totalUse >= kuota) {
      return { 
        available: false, 
        message: "Voucher sudah habis digunakan" 
      };
    }

    // ✅ Voucher tersedia (tapi masih perlu validasi ulang saat di-lock)
    return {
      available: true,
      remaining: kuota - totalUse,
      voucher: voucher
    };

  } catch (error) {
    console.error("Check voucher error:", error);
    return { 
      available: false, 
      message: "Gagal memeriksa voucher" 
    };
  }
}

// ========================================
// HELPER: Get voucher usage stats (untuk monitoring)
// ========================================
/**
 * Helper untuk melihat statistik penggunaan voucher
 * Berguna untuk monitoring dan analytics
 */
export async function getVoucherUsageStats(voucherId) {
  try {
    const voucher = await db("vouchers")
      .where("id", voucherId)
      .first();

    if (!voucher) {
      return null;
    }

    // Convert varchar to number
    const totalUse = Number(voucher.total_use) || 0;
    const kuota = Number(voucher.kuota) || 0;
    const usagePercentage = kuota > 0 ? (totalUse / kuota * 100).toFixed(2) : 0;

    return {
      id: voucher.id,
      name: voucher.name,
      type: voucher.type,
      total: voucher.total,
      total_use: totalUse,
      kuota: kuota,
      remaining: kuota - totalUse,
      usage_percentage: usagePercentage,
      is_full: totalUse >= kuota,
      is_active: voucher.is_active === 1
    };

  } catch (error) {
    console.error("Get voucher stats error:", error);
    return null;
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

    console.log("gamepoint result", result);
    

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

    console.log("moogold result", result);

    if (result.status === "processing" || result.status === "true") {
      return {
        success: true,
        message: "Success Transaction Provider",
        data: result,
        provider_order_id: result.order_id
      };
    } else {
      return {
        success: false,
        message: "Failed to create Transaction Error Provider",
        data: null
      };
    }

  } else if (productInProvider.provider_name === "DIGIFLASH") {
    const result = await digiflash.order(
      values[0],
      values[1] ?? null,
      data.selectedPackage.product_id_from_provider,
      orderId
    );

    console.log("digiflash result", result);

    if (result.data.status === "Pending" || result.data.status === "Sukses") {
      return {
        success: true,
        message: "Success Transaction Provider",
        data: result.data,
        provider_order_id: result.data.customer_no
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