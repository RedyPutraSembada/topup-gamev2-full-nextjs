"use server";

import axios from "axios";
import crypto from "crypto";

export async function getPaymentMethod() {
  const merchantCode = process.env.DUITKU_MERCHANT_CODE;
  const apiKey = process.env.DUITKU_API_KEY;
  const baseUrl = process.env.DUITKU_BASE_URL;

  const datetime = new Date().toISOString().slice(0, 19).replace("T", " ");
  const paymentAmount = 10000;

  const signature = crypto
    .createHash("sha256")
    .update(merchantCode + paymentAmount + datetime + apiKey)
    .digest("hex");

  const payload = {
    merchantcode: merchantCode,
    amount: paymentAmount,
    datetime,
    signature,
  };

  try {
    const response = await fetch(
      `${baseUrl}/webapi/api/merchant/paymentmethod/getpaymentmethod`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const data = await response.json();
    return data; // ✅ server action return
  } catch (err) {
    console.error("Duitku error:", err);
    throw new Error(err.message);
  }
}

async function requestInquiry(amount, method, phone, email) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const merchantOrderId = timestamp + process.env.DUITKU_MERCHANT_CODE;
  const inquiryUrl = process.env.DUITKU_INQUIRY_URL;

  const raw =
    process.env.DUITKU_MERCHANT_CODE +
    merchantOrderId +
    parseInt(amount) +
    process.env.DUITKU_API_KEY;
  const signature = crypto.createHash("md5").update(raw).digest("hex");

  const payload = {
    merchantCode: process.env.DUITKU_MERCHANT_CODE,
    paymentAmount: amount,
    paymentMethod: method,
    phoneNumber: phone,
    email: email,
    merchantOrderId,
    customerVaName: process.env.APP_NAME,
    returnUrl: "https://goxpay.id/payment",
    signature,
    expiryPeriod: 3600,
  };

  const response = await axios.post(inquiryUrl, payload, {
    timeout: 10000,
  });

  return response.data;
}
