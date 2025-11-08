"use server";

import crypto from "crypto";
import axios from "axios";

// Ambil dari .env
const DIGI_USERNAME = process.env.DIGIFLASH_USERNAME;
const DIGI_API_KEY = process.env.DIGIFLASH_SECRET_KEY;

const BASE_URL = "https://api.digiflazz.com";

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

// 🔹 CONNECT FUNCTION (mirip cURL versi JS)
async function connect(path, data) {
  try {
    const res = await axios.post(`${BASE_URL}${path}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Digiflazz Error:", err?.response?.data || err);
    return { status: false, message: "Request failed" };
  }
}

// 🔹 ORDER FUNCTION
export async function order(uid, zone, service, order_id) {
  const target = `${uid}${zone}`;
  const sign = md5(DIGI_USERNAME + DIGI_API_KEY + String(order_id));

  const body = {
    username: DIGI_USERNAME,
    buyer_sku_code: service,
    customer_no: target,
    ref_id: String(order_id),
    sign,
  };

  return connect("/v1/transaction", body);
}

// 🔹 STATUS CHECK
export async function status(poid, pid, uid, zone) {
  const target = `${uid}${zone}`;
  const sign = md5(DIGI_USERNAME + DIGI_API_KEY + String(poid));

  const body = {
    command: "status-pasca",
    username: DIGI_USERNAME,
    buyer_sku_code: pid,
    customer_no: target,
    ref_id: poid,
    sign,
  };

  return connect("/v1/transaction", body);
}

// 🔹 PRICE LIST
export async function harga() {
  const sign = md5(DIGI_USERNAME + DIGI_API_KEY + "pricelist");

  const body = {
    username: DIGI_USERNAME,
    sign,
  };

  return connect("/v1/price-list", body);
}
