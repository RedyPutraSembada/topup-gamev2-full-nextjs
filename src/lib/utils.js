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

export function toIndoDatetime(dateString) {
  const date = new Date(dateString);

  const bulanIndo = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dd = date.getDate();
  const mm = bulanIndo[date.getMonth()];
  const yyyy = date.getFullYear();

  const hh = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");

  return `${dd} ${mm} ${yyyy}, ${hh}:${min} WIB`;
}