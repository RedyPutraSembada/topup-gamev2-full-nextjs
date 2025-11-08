"use server";

import jwt from "jsonwebtoken";
import axios from "axios";

const GP_SECRET = process.env.GP_SECRET_KEY;
const GP_PARTNER = process.env.GP_PARTNER_ID;

const API_URL = "https://api.gamepointclub.net";

async function connect(endpoint, payload) {
  const data = JSON.stringify({
    payload: jwt.sign(payload, GP_SECRET, { algorithm: "HS256" }),
  });

  const res = await axios.post(API_URL + endpoint, data, {
    headers: {
      "Content-Type": "application/json",
      partnerid: GP_PARTNER,
    },
  });

  return res.data;
}

// login
export async function login() {
  const payload = { timestamp: Math.floor(Date.now() / 1000) };
  return await connect("/merchant/token", payload);
}

// get product list
export async function getProduct() {
  const loginData = await login();
  return await connect("/product/list", {
    timestamp: Math.floor(Date.now() / 1000),
    token: loginData.token,
  });
}

// get item detail
export async function getItem(productId) {
  const loginData = await login();
  return await connect("/product/detail", {
    timestamp: Math.floor(Date.now() / 1000),
    token: loginData.token,
    productid: productId,
  });
}

// validate
export async function validateOrder(token, product, id, zone) {
  const orderId = `HURI4U${Math.random().toString(36).substring(2, 11)}`;

  return await connect("/order/validate", {
    timestamp: Math.floor(Date.now() / 1000),
    token,
    referenceno: orderId,
    productid: product,
    fields: {
      input1: id,
      input2: zone || null,
    },
  });
}

// create order
export async function order(trxid, product, id, zone) {
  const loginData = await login();
  const [productId, pkg] = product.split(",");

  const validation = await validateOrder(loginData.token, productId, id, zone);

  const result = await connect("/order/create", {
    timestamp: Math.floor(Date.now() / 1000),
    token: loginData.token,
    validate_token: validation.validation_token,
    packageid: parseInt(pkg),
    merchantcode: trxid,
  });

  if ([100, 101].includes(result.code)) {
    return {
      status: true,
      transactionId: result.referenceno,
    };
  } else {
    return {
      status: false,
      message: result.message,
    };
  }
}

// check status
export async function status(reference) {
  const loginData = await login();

  return await connect("/order/inquiry", {
    timestamp: Math.floor(Date.now() / 1000),
    token: loginData.token,
    referenceno: reference,
  });
}
