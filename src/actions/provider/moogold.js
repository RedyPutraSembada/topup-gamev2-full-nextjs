"use server";

import crypto from "crypto";
import axios from "axios";

const PARTNER_ID = process.env.MOOGOLD_PARTNER_ID;
const SECRET_KEY = process.env.MOOGOLD_SECRET_KEY;

function generateRandomString(length) {
  const characters = "QWERTYUIOPLKJHGFDSAZXCVBNM";
  let result = "CENTRA-";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateBasicAuth(username, password) {
  return Buffer.from(`${username}:${password}`).toString("base64");
}

function generateAuthSignature(payload, timestamp, path, secret) {
  const stringToSign = payload + timestamp + path;
  return crypto.createHmac("sha256", secret).update(stringToSign).digest("hex");
}

export async function order(product_id_from_provider, id, zone) {
  const url = "https://moogold.com/wp-json/v1/api/order/create_order";
  const timestamp = Math.floor(Date.now() / 1000);

  const [category, product, qty] = product_id_from_provider.split(",");


  const payload = JSON.stringify({
    path: "order/create_order",
    data: {
      category: category,
      "product-id": product,
      quantity: qty,
      "User ID": id,
      "Server ID": zone,
    },
    partnerOrderId: generateRandomString(7),
  });

  const basicAuth = generateBasicAuth(PARTNER_ID, SECRET_KEY);
  const signature = generateAuthSignature(
    payload,
    timestamp,
    "order/create_order",
    SECRET_KEY
  );

  try {
    const response = await axios.post(url, JSON.parse(payload), {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        auth: signature,
        timestamp,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Moogold API Error", err?.response?.data || err);
    return { error: true, message: "Request failed" };
  }
}
