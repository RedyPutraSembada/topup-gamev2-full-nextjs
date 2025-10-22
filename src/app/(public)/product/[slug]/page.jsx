"use client";
import { useState } from 'react';
import { Check, Info } from 'lucide-react';

export default function GameDetailPage() {
  const [selectedDiamond, setSelectedDiamond] = useState(null);
  const [accountId, setAccountId] = useState('');
  const [serverId, setServerId] = useState('');

  const diamondPackages = [
    { id: 1, amount: '50 Diamonds', price: 'Rp 15.000', bonus: '' },
    { id: 2, amount: '100 Diamonds', price: 'Rp 28.000', bonus: '+5' },
    { id: 3, amount: '250 Diamonds', price: 'Rp 68.000', bonus: '+15' },
    { id: 4, amount: '500 Diamonds', price: 'Rp 135.000', bonus: '+35' },
    { id: 5, amount: '1000 Diamonds', price: 'Rp 265.000', bonus: '+80' },
    { id: 6, amount: '2000 Diamonds', price: 'Rp 525.000', bonus: '+180' },
    { id: 7, amount: '3000 Diamonds', price: 'Rp 785.000', bonus: '+280' },
    { id: 8, amount: '5000 Diamonds', price: 'Rp 1.300.000', bonus: '+500' },
  ];

  const paymentMethods = [
    { id: 1, name: 'QRIS', icon: '📱' },
    { id: 2, name: 'GoPay', icon: '💳' },
    { id: 3, name: 'OVO', icon: '💰' },
    { id: 4, name: 'DANA', icon: '💵' },
    { id: 5, name: 'ShopeePay', icon: '🛒' },
    { id: 6, name: 'Bank Transfer', icon: '🏦' },
  ];

  const [selectedPayment, setSelectedPayment] = useState(null);

  return (
    <div className={`bg-gray-900 text-white`}>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1600&h=600&fit=crop"
          alt="Mobile Legends"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 lg:px-8 pb-6">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-gray-800 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=200&fit=crop"
                alt="Mobile Legends Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Mobile Legends: Bang Bang</h1>
              <p className="text-gray-400 text-sm md:text-base">Top up diamonds cepat & aman</p>
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
            <div className={`rounded-2xl bg-gray-800 p-6`}>
              <h2 className="text-xl font-bold mb-4">Pilih Nominal Diamond</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {diamondPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedDiamond(pkg.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedDiamond === pkg.id
                        ? 'border-indigo-600 bg-indigo-600/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {selectedDiamond === pkg.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-bold text-sm md:text-base">{pkg.amount}</p>
                      {pkg.bonus && (
                        <p className="text-xs text-yellow-500 mt-1">Bonus {pkg.bonus}</p>
                      )}
                      <p className="text-indigo-400 font-semibold mt-2 text-sm md:text-base">{pkg.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className={`rounded-2xl bg-gray-800 p-6`}>
              <h2 className="text-xl font-bold mb-4">Pilih Metode Pembayaran</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === method.id
                        ? 'border-indigo-600 bg-indigo-600/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {selectedPayment === method.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl mb-2">{method.icon}</div>
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
              
              {/* Account ID */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  User ID / Zone ID
                </label>
                <input
                  type="text"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="Contoh: 12345678"
                  className={`w-full px-4 py-3 rounded-lg border 'bg-gray-900 border-gray-700 focus:border-indigo-600'
                       focus:outline-none focus:ring-2 focus:ring-indigo-600/20`}
                />
              </div>

              {/* Server ID */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Server ID
                </label>
                <input
                  type="text"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder="Contoh: 9012"
                  className={`w-full px-4 py-3 rounded-lg border bg-gray-900 border-gray-700 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20`}
                />
              </div>

              {/* Info Box */}
              <div className={`mb-6 p-3 rounded-lg bg-blue-900/20 border border-blue-800`}>
                <div className="flex gap-2">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">
                    Untuk menemukan User ID & Zone ID, silakan klik avatar Anda di kiri atas dalam game
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Item</span>
                  <span className="font-medium">
                    {selectedDiamond ? diamondPackages.find(p => p.id === selectedDiamond)?.amount : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Harga</span>
                  <span className="font-medium">
                    {selectedDiamond ? diamondPackages.find(p => p.id === selectedDiamond)?.price : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Biaya Admin</span>
                  <span className="font-medium">Rp 1.000</span>
                </div>
                <div className={`pt-2 mt-2 border-t border-gray-700 flex justify-between`}>
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-indigo-400 text-lg">
                    {selectedDiamond 
                      ? `Rp ${(parseInt(diamondPackages.find(p => p.id === selectedDiamond)?.price.replace(/\D/g, '')) + 1000).toLocaleString('id-ID')}`
                      : '-'}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <button
                disabled={!selectedDiamond || !accountId || !serverId || !selectedPayment}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  !selectedDiamond || !accountId || !serverId || !selectedPayment
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {!selectedDiamond || !accountId || !serverId || !selectedPayment
                  ? 'Lengkapi Data'
                  : 'Beli Sekarang'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Dengan melanjutkan, Anda menyetujui syarat & ketentuan kami
              </p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className={`mt-8 rounded-2xl bg-gray-800 p-6`}>
          <h2 className="text-xl font-bold mb-4">Cara Top Up Mobile Legends</h2>
          <ol className="space-y-3 text-gray-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Masukkan User ID & Zone ID Mobile Legends Anda</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Pilih nominal Diamond yang diinginkan</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Pilih metode pembayaran</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Klik "Beli Sekarang" dan selesaikan pembayaran</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">5</span>
              <span>Diamond akan otomatis masuk ke akun Anda dalam 1-5 menit</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}