"use client";

import { checkUsernameGame } from "@/actions/public/cek-username/cek-username";
import { checkVoucher } from "@/actions/public/voucher/public-voucher";
import { createTransaction } from "@/actions/transaction/transaction";
import { formatRupiah } from "@/lib/utils";
import { authClient } from "@/utils/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Info, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export function PublicFormProduct({ product, paymentMethod }) {
  const { data: session, isPending: loading } = authClient.useSession();

  const userIdLogin = session?.user?.id || "";

  const [selectedDiamond, setSelectedDiamond] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [voucher, setVoucher] = useState("");
  const [voucherData, setVoucherData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [nickname, setNickname] = useState("");

  const queryClient = useQueryClient();

  const diamondPackages = product?.providers || [];

  let type_data_product = product?.type_data_product || [];

  if (typeof type_data_product === "string") {
    try {
      type_data_product = JSON.parse(type_data_product);
    } catch {
      type_data_product = [];
    }
  }

  const sortedTypes = Array.isArray(type_data_product)
    ? [...type_data_product].sort((a, b) => a.order - b.order)
    : [];

  const grouped = {};
  sortedTypes.forEach((t) => {
    grouped[t.name] = diamondPackages.filter((p) => p.type === t.name);
  });

  const paymentMethods =
    paymentMethod.paymentFee.map((pm) => ({
      id: pm.paymentMethod,
      name: pm.paymentName,
      image: pm.paymentImage,
    })) ?? [];

  const dataInputs = JSON.parse(product.data_input || "[]");

  const [formValues, setFormValues] = useState(
    dataInputs.reduce((obj, field) => {
      obj[field.name] = "";
      return obj;
    }, {})
  );

  const allFilled = Object.values(formValues).every((v) => v.trim() !== "");

  // Cek apakah perlu validasi username
  const needUsernameCheck = product.is_check_username === 1;
  const canProceed = needUsernameCheck ? usernameChecked : true;

  const handleChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset username check jika ada perubahan input
    if (needUsernameCheck && usernameChecked) {
      setUsernameChecked(false);
      setNickname("");
    }
  };

  // Mutation untuk check username
  const checkUsernameMutation = useMutation({
    mutationFn: checkUsernameGame,
    onSuccess: (data) => {
      setUsernameChecked(true);
      setNickname(data.nickname);
      toast.success(`Username ditemukan: ${data.nickname}`);
    },
    onError: (error) => {
      setUsernameChecked(false);
      setNickname("");
      toast.error(error.message || "Gagal memvalidasi ID");
    },
  });

  const handleCheckUsername = () => {
    if (!allFilled) {
      toast.error("Lengkapi semua data terlebih dahulu");
      return;
    }

    const inputValues = Object.values(formValues);
    const userId = inputValues[0];
    const zoneId = inputValues[1];

    checkUsernameMutation.mutate({ typeName: product.kode, userId, zoneId });
  };

  const checkVoucherMutation = useMutation({
    mutationFn: checkVoucher,
    onSuccess: (data) => {
      if (data && data.id) {
        // Cek apakah kuota masih tersedia
        const totalUse = Number(data.total_use) || 0;
        const kuota = Number(data.kuota);

        if (totalUse >= kuota) {
          setVoucherData(null);
          setDiscount(0);
          toast.error("Kuota voucher sudah habis");
          return;
        }

        setVoucherData(data);

        // Hitung diskon berdasarkan type
        let discountAmount = 0;
        const selectedPackage = diamondPackages.find(
          (p) => p.product_id_from_provider === selectedDiamond
        );

        if (selectedPackage) {
          const basePrice = Number(selectedPackage.amount_seller);

          if (data.type === "amount") {
            // Diskon nominal tetap dari field 'total'
            discountAmount = Number(data.total) || 0;

            // Pastikan diskon tidak melebihi harga
            if (discountAmount > basePrice) {
              discountAmount = basePrice;
            }
          } else if (data.type === "percent") {
            // Diskon persentase (asumsi field 'total' berisi persentase)
            const percent = Number(data.total) || 0;
            discountAmount = (basePrice * percent) / 100;
          }
        }

        setDiscount(Math.round(discountAmount));
        toast.success(
          `Voucher berhasil diterapkan! Diskon: ${formatRupiah(
            Math.round(discountAmount)
          )}`
        );
      } else {
        throw new Error("Voucher tidak valid");
      }

      queryClient.invalidateQueries({ queryKey: ["check-voucher"] });
    },
    onError: (error) => {
      setVoucherData(null);
      setDiscount(0);
      toast.error("Voucher tidak valid atau sudah tidak aktif");
    },
  });

  async function handleCheckVoucher() {
    if (!voucher.trim()) {
      toast.error("Masukkan kode voucher terlebih dahulu");
      return;
    }

    if (!selectedDiamond) {
      toast.error("Pilih paket terlebih dahulu");
      return;
    }

    await checkVoucherMutation.mutateAsync(voucher);
  }

  const handleRemoveVoucher = () => {
    setVoucher("");
    setVoucherData(null);
    setDiscount(0);
    toast.info("Voucher dihapus");
  };

  // Hitung total
  const selectedPackage = selectedDiamond
    ? diamondPackages.find(
        (p) => p.product_id_from_provider === selectedDiamond
      )
    : null;

  const basePrice = selectedPackage ? Number(selectedPackage.amount_seller) : 0;
  const subtotal = basePrice;
  const total = subtotal - discount;

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Transaksi berhasil dibuat", {
          description: "Silakan lakukan pembayaran di halaman transaksi",
        });
      } else {
        toast.error(data.message || "Gagal membuat transaksi");
      }
      console.log("data", data);
      // toast.success("Transaksi berhasil dibuat", {
      //   description: "Silakan lakukan pembayaran di halaman transaksi",
      // });
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error.message || "Gagal membuat transaksi");
    },
  });

  // Handler untuk tombol Beli Sekarang
  const handleBuyNow = () => {
    // Kumpulkan semua data yang diperlukan
    const orderData = {
      userId: userIdLogin, //->TO DATABASE "user_id"
      // Data Produk
      product: {
        id: product.id,
        kode: product.kode,
      },

      // Data Paket yang Dipilih
      selectedPackage: {
        product_id_from_provider: selectedDiamond,
        id_product_in_provider: selectedPackage?.id, //->TO DATABASE "product_in_provider_id"
        name: selectedPackage?.name,
        amount_seller: selectedPackage?.amount_seller,
        type: selectedPackage?.type,
      },

      // Data Payment Method
      selectedPaymentMethod: {
        id: selectedPayment,
        payment_method:
          paymentMethods.find((pm) => pm.id === selectedPayment)?.name !==
          "saldo"
            ? "saldo"
            : "saldo", //->TO DATABASE
        name: paymentMethods.find((pm) => pm.id === selectedPayment)?.name,
        image: paymentMethods.find((pm) => pm.id === selectedPayment)?.image,
      },

      // Data Input dari User (User ID, Zone ID, dll)
      userInputs: formValues, //->TO DATABASE "data_input_user"

      // Data Username yang Terverifikasi (jika ada)
      verifiedUsername: usernameChecked
        ? {
            nickname: nickname,
            verified: true,
          }
        : null,

      // Data Voucher (jika ada)
      voucher: voucherData
        ? {
            code: voucher,
            voucher_id: voucherData.id, //->TO DATABASE "voucher_id"
            voucher: voucherData.name, //->TO DATABASE
            type: voucherData.type,
            discount_amount: discount,
          }
        : null,

      // Data Harga
      pricing: {
        base_price: basePrice, //->TO DATABASE "price"
        discount: discount,
        subtotal: subtotal,
        total: total, //->TO DATABASE "total_amount"
      },

      // Timestamp
      timestamp: new Date().toISOString(),
    };

    // Log semua data
    console.log("=== DATA PEMBELIAN ===");
    console.log(JSON.stringify(orderData, null, 2));
    console.log("======================");

    // Tampilkan toast untuk konfirmasi
    createTransactionMutation.mutateAsync(orderData);
    // toast.success("Data berhasil dikumpulkan! Cek console untuk detailnya.");
  };

  return (
    <div className={`bg-gray-900 text-white`}>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={product.image_cover}
          alt={product.title}
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 lg:px-8 pb-6">
          <div className="flex items-end gap-4">
            <div className="relative w-20 h-20 md:w-25 md:h-35 rounded-2xl overflow-hidden border-4 border-gray-800 shrink-0">
              <Image
                src={product.image_thumbnail}
                alt={product.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {product.title}
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Section - Diamond Packages */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diamond Packages */}
            {sortedTypes.map((t) => (
              <div key={t.name} className="rounded-2xl bg-gray-800 p-6">
                <h3 className="font-bold text-lg mb-2 capitalize">{t.name}</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {grouped[t.name].map((pkg) => (
                    <button
                      key={pkg.product_id_from_provider}
                      onClick={() => {
                        setSelectedDiamond(pkg.product_id_from_provider);
                        // Reset voucher jika ganti paket
                        if (voucherData) {
                          handleRemoveVoucher();
                        }
                      }}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        selectedDiamond === pkg.product_id_from_provider
                          ? "border-indigo-600 bg-indigo-600/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      {selectedDiamond === pkg.product_id_from_provider && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}

                      <div className="text-left">
                        <p className="font-bold text-sm md:text-base">
                          {pkg.name}
                        </p>
                        <p className="text-indigo-400 font-semibold mt-2 text-sm md:text-base">
                          {formatRupiah(pkg.amount_seller)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Payment Method */}
            <div className={`rounded-2xl bg-gray-800 p-6`}>
              <h2 className="text-xl font-bold mb-4">
                Pilih Metode Pembayaran
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === method.id
                        ? "border-indigo-600 bg-indigo-600/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {selectedPayment === method.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    <div className="text-center space-y-2">
                      <div className="relative flex items-center justify-center">
                        <Image
                          src={method.image}
                          alt={method.name}
                          width={40}
                          height={40}
                          unoptimized
                          className="object-contain w-10 h-10"
                        />
                      </div>
                      <p className="font-medium text-sm">{method.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Form Input */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl bg-gray-800 p-6 sticky top-24`}>
              <h2 className="text-xl font-bold mb-4">Masukkan Data Akun</h2>

              {dataInputs.map((field) => (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={formValues[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-lg border bg-gray-900 border-gray-700 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    disabled={usernameChecked}
                  />
                </div>
              ))}

              {/* Check Username Button */}
              {needUsernameCheck && !usernameChecked && (
                <button
                  onClick={handleCheckUsername}
                  disabled={!allFilled || checkUsernameMutation.isPending}
                  className="w-full mb-4 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  {checkUsernameMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memvalidasi...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Validasi ID</span>
                    </>
                  )}
                </button>
              )}

              {/* Username Verified Badge */}
              {usernameChecked && nickname && (
                <div className="mb-4 p-3 rounded-lg bg-green-900/20 border border-green-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-xs text-green-400">
                        Username Terverifikasi
                      </p>
                      <p className="text-sm font-medium text-green-300">
                        {nickname}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUsernameChecked(false);
                      setNickname("");
                    }}
                    className="text-xs text-green-400 hover:text-green-300 underline"
                  >
                    Ubah
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div
                className={`mb-6 p-3 rounded-lg bg-blue-900/20 border border-blue-800`}
              >
                <div className="flex gap-2">
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">
                    Untuk menemukan User ID & Zone ID, silakan klik avatar Anda
                    di kiri atas dalam game
                  </p>
                </div>
              </div>

              {/* Voucher Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Voucher (Opsional)
                </label>

                {!voucherData ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucher}
                      onChange={(e) => setVoucher(e.target.value.toUpperCase())}
                      placeholder="Masukkan kode voucher"
                      className="w-full px-4 py-3 rounded-lg border bg-gray-900 border-gray-700 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      disabled={checkVoucherMutation.isPending}
                    />
                    <button
                      onClick={handleCheckVoucher}
                      disabled={
                        checkVoucherMutation.isPending || !voucher.trim()
                      }
                      className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors whitespace-nowrap font-semibold"
                    >
                      {checkVoucherMutation.isPending ? "Cek..." : "Terapkan"}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-green-900/20 border border-green-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-300">
                          {voucherData.name}
                        </p>
                        <p className="text-xs text-green-400">
                          Diskon: {formatRupiah(discount)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="p-1 hover:bg-green-800/30 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-green-300" />
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Item</span>
                  <span className="font-medium">
                    {selectedPackage?.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Harga</span>
                  <span className="font-medium">
                    {selectedPackage ? formatRupiah(basePrice) : "-"}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Diskon Voucher</span>
                    <span className="font-medium text-green-400">
                      - {formatRupiah(discount)}
                    </span>
                  </div>
                )}

                <div
                  className={`pt-2 mt-2 border-t border-gray-700 flex justify-between`}
                >
                  <span className="font-bold">Total Pembayaran</span>
                  <span className="font-bold text-indigo-400 text-lg">
                    {selectedPackage ? formatRupiah(total) : "-"}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuyNow}
                disabled={
                  !selectedDiamond ||
                  !selectedPayment ||
                  !allFilled ||
                  !canProceed
                }
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  !selectedDiamond ||
                  !selectedPayment ||
                  !allFilled ||
                  !canProceed
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {!selectedDiamond || !selectedPayment || !allFilled
                  ? "Lengkapi Data"
                  : !canProceed
                    ? "Validasi ID Terlebih Dahulu"
                    : "Beli Sekarang"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Dengan melanjutkan, Anda menyetujui syarat & ketentuan kami
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
