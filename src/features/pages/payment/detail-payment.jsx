"use client"

import { useState } from "react";
import { CheckCircle, Download, Copy, Check, Home, Receipt } from 'lucide-react';

export default function DetailPayment({detailTransaction}) {
    console.log("detailTransaction", detailTransaction);
    
    
    const [darkMode] = useState(true);
    const [copied, setCopied] = useState(false);

    // Dummy data dari transaksi sebelumnya
    const transactionData = {
        orderId: 'INV-2025-10234567',
        date: '23 Oktober 2025, 14:30 WIB',
        game: {
        name: 'Mobile Legends: Bang Bang',
        image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=200&fit=crop'
        },
        diamond: {
        amount: '1000 Diamonds',
        bonus: '+80',
        price: 'Rp 265.000'
        },
        account: {
        userId: '12345678',
        serverId: '9012',
        username: 'ProPlayer123'
        },
        payment: {
        method: 'GoPay',
        total: 'Rp 266.000',
        adminFee: 'Rp 1.000'
        },
        status: 'success'
    };

    const handleCopyOrderId = () => {
        navigator.clipboard.writeText(transactionData.orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Icon & Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4 animate-pulse">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-400">Terima kasih atas pembelian Anda</p>
        </div>

        {/* Order ID Card */}
        <div className={`rounded-2xl bg-gray-800 p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Nomor Pesanan</p>
              <p className="text-xl font-bold">{transactionData.orderId}</p>
            </div>
            <button
              onClick={handleCopyOrderId}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Salin</span>
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-400">{transactionData.date}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Transaction Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game & Product Info */}
            <div className={`rounded-2xl bg-gray-800 p-6`}>
              <h2 className="text-lg font-bold mb-4">Detail Produk</h2>
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={transactionData.game.image}
                    alt={transactionData.game.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{transactionData.game.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-indigo-400">
                      {transactionData.diamond.amount}
                    </span>
                    {transactionData.diamond.bonus && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-lg text-xs font-bold">
                        Bonus {transactionData.diamond.bonus}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Diamond akan otomatis masuk ke akun dalam 1-5 menit
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className={`rounded-2xl bg-gray-800 p-6`}>
              <h2 className="text-lg font-bold mb-4">Informasi Akun</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Username</span>
                  <span className="font-medium">{transactionData.account.username}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-700">
                  <span className="text-gray-400">User ID</span>
                  <span className="font-medium">{transactionData.account.userId}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-700">
                  <span className="text-gray-400">Server ID</span>
                  <span className="font-medium">{transactionData.account.serverId}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className={`rounded-2xl bg-gray-800 p-6`}>
              <h2 className="text-lg font-bold mb-4">Informasi Pembayaran</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Metode Pembayaran</span>
                  <span className="font-medium">{transactionData.payment.method}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-700">
                  <span className="text-gray-400">Harga Diamond</span>
                  <span className="font-medium">{transactionData.diamond.price}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-700">
                  <span className="text-gray-400">Biaya Admin</span>
                  <span className="font-medium">{transactionData.payment.adminFee}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t-2 border-gray-700">
                  <span className="font-bold text-lg">Total Pembayaran</span>
                  <span className="font-bold text-xl text-indigo-400">{transactionData.payment.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl bg-gray-800 p-6 sticky top-24 space-y-4`}>
              <h2 className="text-lg font-bold mb-4">Aksi Cepat</h2>

              {/* Download Invoice */}
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors">
                <Download className="w-5 h-5" />
                Download Invoice
              </button>

              {/* View Receipt */}
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors">
                <Receipt className="w-5 h-5" />
                Lihat Struk
              </button>

              {/* Back to Home */}
              <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-700 hover:bg-gray-700 rounded-xl font-medium transition-colors">
                <Home className="w-5 h-5" />
                Kembali ke Beranda
              </button>

              {/* Status Info */}
              <div className={`mt-6 p-4 rounded-xl bg-green-900/20 border border-green-800`}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-400 mb-1">Pembayaran Terverifikasi</p>
                    <p className="text-sm text-green-300/80">
                      Diamond sedang diproses dan akan masuk ke akun Anda segera
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Butuh bantuan?</p>
                <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                  Hubungi Customer Service →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className={`mt-8 rounded-2xl bg-blue-900/20 border border-blue-800 p-6`}>
          <h3 className="font-bold mb-2 text-blue-400">Catatan Penting</h3>
          <ul className="space-y-2 text-sm text-blue-300">
            <li>• Diamond akan otomatis masuk ke akun game Anda dalam 1-5 menit</li>
            <li>• Jika lebih dari 10 menit diamond belum masuk, silakan hubungi customer service</li>
            <li>• Simpan invoice ini sebagai bukti transaksi</li>
            <li>• Untuk komplain atau pertanyaan, sertakan nomor pesanan Anda</li>
          </ul>
        </div>
      </div>
    )
}