"use client"

import { useState, useMemo } from "react";
import { CheckCircle, Download, Copy, Check, Home, Receipt, Clock, ExternalLink } from 'lucide-react';

// Helper function untuk format tanggal
const toIndoDatetime = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function untuk format rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

export default function DetailPayment({detailTransaction}) {
    console.log("detailTransaction", detailTransaction);
    
    const [copied, setCopied] = useState(false);
    
    // Parse data input user
    const parsedDataForm = useMemo(() => {
      try {
        return JSON.parse(detailTransaction.data_input_user);
      } catch (error) {
        console.error("Error parsing data_input_user:", error);
        return {};
      }
    }, [detailTransaction.data_input_user]);

    // Parse data input product (untuk label)
    const dataInputProduct = useMemo(() => {
      try {
        return JSON.parse(detailTransaction.data_input_product);
      } catch (error) {
        console.error("Error parsing data_input_product:", error);
        return [];
      }
    }, [detailTransaction.data_input_product]);

    console.log("parsedDataForm", parsedDataForm);
    console.log("dataInputProduct", dataInputProduct);

    // Mapping user inputs dengan label dari data_input_product
    const mappedUserInputs = useMemo(() => {
      if (!parsedDataForm.userInputs || !Array.isArray(dataInputProduct)) return [];
      
      return Object.entries(parsedDataForm.userInputs).map(([key, value]) => {
        const inputConfig = dataInputProduct.find(input => input.name === key);
        return {
          key,
          label: inputConfig?.label || key,
          value: value || '-'
        };
      });
    }, [parsedDataForm.userInputs, dataInputProduct]);

    // Cek apakah user login
    const isLoggedIn = detailTransaction.user_id && detailTransaction.user_id !== '';
    
    // Hitung pricing
    const pricing = useMemo(() => {
      const basePrice = parseFloat(isLoggedIn 
        ? detailTransaction.amount_member 
        : detailTransaction.amount_seller) || 0;
      
      let discount = 0;
      let subtotal = basePrice;
      
      // Jika ada voucher
      if (parsedDataForm.voucher && parsedDataForm.pricing) {
        discount = parsedDataForm.pricing.discount || 0;
        subtotal = parsedDataForm.pricing.subtotal || basePrice;
      }
      
      const feePg = parseFloat(detailTransaction.fee_pg) || 0;
      const total = parseFloat(detailTransaction.total_amount) || (subtotal - discount);
      
      return {
        basePrice,
        discount,
        subtotal,
        feePg,
        total
      };
    }, [detailTransaction, parsedDataForm, isLoggedIn]);

    // Status payment
    const paymentStatus = detailTransaction.payment_progress?.toLowerCase();
    const isSuccess = paymentStatus === 'success' || paymentStatus === 'completed';
    const isPending = paymentStatus === 'pending' || paymentStatus === 'processing';

    const handleCopyOrderId = () => {
        navigator.clipboard.writeText(detailTransaction.order_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePayment = () => {
      if (detailTransaction.url_payment) {
        window.open(detailTransaction.url_payment, '_blank');
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success/Pending Icon & Message */}
        <div className="text-center mb-8">
          {isSuccess ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4 animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-white">Pembayaran Berhasil!</h1>
              <p className="text-gray-400">Terima kasih atas pembelian Anda</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600 rounded-full mb-4 animate-pulse">
                <Clock className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-white">Menunggu Pembayaran</h1>
              <p className="text-gray-400">Silakan selesaikan pembayaran Anda</p>
            </>
          )}
        </div>

        {/* Order ID Card */}
        <div className="rounded-2xl bg-gray-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Nomor Pesanan</p>
              <p className="text-xl font-bold text-white">{detailTransaction.order_id}</p>
            </div>
            <button
              onClick={handleCopyOrderId}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-white">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">Salin</span>
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-400">{toIndoDatetime(detailTransaction.created_at)}</p>
          
          {/* Status Badge */}
          <div className="mt-4">
            {isSuccess ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-700 text-green-400 rounded-lg text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Pembayaran Berhasil
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-900/30 border border-yellow-700 text-yellow-400 rounded-lg text-sm font-medium">
                <Clock className="w-4 h-4" />
                Menunggu Pembayaran
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Transaction Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game & Product Info */}
            <div className="rounded-2xl bg-gray-800 p-6">
              <h2 className="text-lg font-bold mb-4 text-white">Detail Produk</h2>
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-700">
                  <img
                    src={detailTransaction.product_image || 'https://via.placeholder.com/200'}
                    alt={detailTransaction.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1 text-white">{detailTransaction.product_name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-indigo-400">
                      {detailTransaction.product_in_provider_name}
                    </span>
                    {parsedDataForm.selectedPackage?.type === 'promo' && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-lg text-xs font-bold">
                        PROMO
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {isSuccess 
                      ? "Diamond akan otomatis masuk ke akun dalam 1-5 menit" 
                      : "Selesaikan pembayaran untuk memproses pesanan"}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="rounded-2xl bg-gray-800 p-6">
              <h2 className="text-lg font-bold mb-4 text-white">Informasi Akun</h2>
              <div className="space-y-3">
                {parsedDataForm.verifiedUsername?.nickname && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Username</span>
                    <span className="font-medium text-white flex items-center gap-2">
                      {parsedDataForm.verifiedUsername.nickname}
                      {parsedDataForm.verifiedUsername.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </span>
                  </div>
                )}
                
                {mappedUserInputs.map((input, index) => (
                  <div 
                    key={input.key} 
                    className={`flex justify-between items-center py-2 ${index > 0 ? 'border-t border-gray-700' : ''}`}
                  >
                    <span className="text-gray-400">{input.label}</span>
                    <span className="font-medium text-white">{input.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-2xl bg-gray-800 p-6">
              <h2 className="text-lg font-bold mb-4 text-white">Informasi Pembayaran</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Metode Pembayaran</span>
                  <span className="font-medium text-white">
                    {parsedDataForm.selectedPaymentMethod?.name || detailTransaction.metode}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-t border-gray-700">
                  <span className="text-gray-400">Harga {isLoggedIn ? '(Member)' : '(Guest)'}</span>
                  <span className="font-medium text-white">{formatRupiah(pricing.basePrice)}</span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between items-center py-2 border-t border-gray-700">
                    <span className="text-gray-400">
                      Diskon ({parsedDataForm.voucher?.code})
                      {/* {parsedDataForm.voucher?.type === 'percent' && (
                        <span className="text-green-500 ml-1">
                          ({parsedDataForm.voucher.discount_amount}%)
                        </span>
                      )} */}
                    </span>
                    <span className="font-medium text-green-500">-{formatRupiah(pricing.discount)}</span>
                  </div>
                )}

                {pricing.feePg > 0 && (
                  <div className="flex justify-between items-center py-2 border-t border-gray-700">
                    <span className="text-gray-400">Biaya Admin</span>
                    <span className="font-medium text-white">{formatRupiah(pricing.feePg)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-3 border-t-2 border-gray-700">
                  <span className="font-bold text-lg text-white">Total Pembayaran</span>
                  <span className="font-bold text-xl text-indigo-400">{formatRupiah(pricing.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-gray-800 p-6 sticky top-24 space-y-4">
              <h2 className="text-lg font-bold mb-4 text-white">Aksi Cepat</h2>

              {/* Conditional Buttons based on payment status */}
              {isPending ? (
                <>
                  {/* Lanjutkan Pembayaran */}
                  <button 
                    onClick={handlePayment}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors text-white"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Lanjutkan Pembayaran
                  </button>

                  {/* Virtual Account / QR */}
                  {detailTransaction.va_number && (
                    <div className="p-4 bg-gray-700 rounded-xl">
                      <p className="text-sm text-gray-400 mb-2">Virtual Account</p>
                      <p className="font-mono text-lg font-bold text-white">{detailTransaction.va_number}</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(detailTransaction.va_number);
                          alert('VA Number tersalin!');
                        }}
                        className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
                      >
                        Salin Nomor VA
                      </button>
                    </div>
                  )}
                </>
              ) : isSuccess ? (
                <>
                  {/* Download Invoice */}
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors text-white">
                    <Download className="w-5 h-5" />
                    Download Invoice
                  </button>
                </>
              ) : null}

              {/* Back to Home */}
              <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-700 hover:bg-gray-700 rounded-xl font-medium transition-colors text-white">
                <Home className="w-5 h-5" />
                Kembali ke Beranda
              </button>

              {/* Status Info */}
              {isSuccess ? (
                <div className="mt-6 p-4 rounded-xl bg-green-900/20 border border-green-800">
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
              ) : (
                <div className="mt-6 p-4 rounded-xl bg-yellow-900/20 border border-yellow-800">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-400 mb-1">Menunggu Pembayaran</p>
                      <p className="text-sm text-yellow-300/80">
                        Silakan selesaikan pembayaran sebelum waktu expired
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
        <div className="mt-8 rounded-2xl bg-blue-900/20 border border-blue-800 p-6">
          <h3 className="font-bold mb-2 text-blue-400">Catatan Penting</h3>
          <ul className="space-y-2 text-sm text-blue-300">
            {isSuccess ? (
              <>
                <li>• Diamond akan otomatis masuk ke akun game Anda dalam 1-5 menit</li>
                <li>• Jika lebih dari 10 menit diamond belum masuk, silakan hubungi customer service</li>
                <li>• Simpan invoice ini sebagai bukti transaksi</li>
                <li>• Untuk komplain atau pertanyaan, sertakan nomor pesanan Anda</li>
              </>
            ) : (
              <>
                <li>• Selesaikan pembayaran sebelum waktu expired</li>
                <li>• Pastikan nominal transfer sesuai dengan total pembayaran</li>
                <li>• Jangan transfer dari rekening orang lain</li>
                <li>• Simpan bukti transfer sebagai bukti pembayaran</li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
}