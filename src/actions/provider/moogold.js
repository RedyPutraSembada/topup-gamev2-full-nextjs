"use server";

import crypto from "crypto";
import axios from "axios";
import { parseMessage } from "@/lib/utils";

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



export async function checkRegionML({ userId, serverId }) {
  console.log("id", userId);
  console.log("server", serverId);
  
  if (!userId) throw new Error("Parameter 'userId' cannot be empty");
  if (!serverId) throw new Error("Parameter 'serverId' cannot be empty");

  try {
    const response = await axios.post(
      "https://moogold.com/wp-content/plugins/id-validation-new/id-validation-ajax.php",
      new URLSearchParams({
        "attribute_amount": "Weekly Pass",
        "text-5f6f144f8ffee": userId,
        "text-1601115253775": serverId,
        "quantity": 1,
        "add-to-cart": 15145,
        "product_id": 15145,
        "variation_id": 4690783
      }),
      {
        headers: {
          "Referer": "https://moogold.com/product/mobile-legends/",
          "Origin": "https://moogold.com",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const { message } = response.data

    if (!message) {
      throw new Error("Invalid ID Player or serverId ID")
    }

    const parsedData = parseMessage(message)

    return {
      success: true,
      nickname: parsedData.nickname,
      userId: parsedData.userId,
      serverId: parsedData.serverId,
      country: parsedData.country,
      fullMessage: parsedData.fullMessage
    }
    
  } catch (error) {
    console.error("Check Region ML Error:", error?.response?.data || error.message);
    
    // Throw error dengan message yang jelas
    if (error.response?.data) {
      throw new Error("Invalid ID Player or Server ID");
    }
    throw new Error(error.message || "Failed to check region");
  }
}