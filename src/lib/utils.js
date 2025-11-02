import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function generateOrderId() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = uuidv4().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `GXP-${time}${rand}ID`;
}
