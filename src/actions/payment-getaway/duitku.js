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

export async function requestInquiry(amount, method, phone, email) {
  const merchantCode = process.env.DUITKU_MERCHANT_CODE;
  const apiKey = process.env.DUITKU_API_KEY;
  const inquiryUrl = process.env.DUITKU_INQUIRY_URL;
  
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const merchantOrderId = timestamp + merchantCode;

  // ✅ Format signature: merchantCode + merchantOrderId + amount + apiKey
  const raw = merchantCode + merchantOrderId + parseInt(amount) + apiKey;
  const signature = crypto.createHash("md5").update(raw).digest("hex");

  const payload = {
    merchantCode: merchantCode,  // ⚠️ Perhatikan: PascalCase
    paymentAmount: parseInt(amount),  // ✅ Pastikan tipe number
    paymentMethod: method,
    phoneNumber: phone,
    customerVaName : 'John Doe',
    email: email,
    merchantOrderId: merchantOrderId,
    customerVaName: process.env.APP_NAME || "GOXPAY",
    returnUrl: "https://unintermingled-noncoincident-chandler.ngrok-free.app/payment",
    signature: signature,
    expiryPeriod: 3600,
  };

  try {
    const response = await axios.post(inquiryUrl, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    return response.data;
  } catch (err) {
    // ✅ Log detail error untuk debugging
    console.error("Duitku Inquiry Error:", {
      status: err.response?.status,
      data: err.response?.data,
      payload: payload, // Debugging - hapus di production
    });
    
    throw new Error(
      err.response?.data?.Message || 
      "Failed to create payment inquiry"
    );
  }
}