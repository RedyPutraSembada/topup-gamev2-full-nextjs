"use client";
import { useState } from 'react';
import { Search, MapPin, User, Shield, AlertCircle, CheckCircle, Loader2, Info, Globe } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { checkRegionML } from '@/actions/provider/moogold';

// Fungsi untuk mendapatkan region info dari country
const getRegionInfo = (countryCode) => {
  const regionMap = {
    ID: { name: 'Indonesia', flag: '🌍', code: 'ID' },
    MY: { name: 'Malaysia', flag: '🌍', code: 'MY' },
    SG: { name: 'Singapore', flag: '🌍', code: 'SG' },
    TH: { name: 'Thailand', flag: '🌍', code: 'TH' },
    PH: { name: 'Philippines', flag: '🌍', code: 'PH' },
    VN: { name: 'Vietnam', flag: '🌍', code: 'VN' },
    MM: { name: 'Myanmar', flag: '🌍', code: 'MM' },
    KH: { name: 'Cambodia', flag: '🌍', code: 'KH' },
    LA: { name: 'Laos', flag: '🌍', code: 'LA' },
    IN: { name: 'India', flag: '🌍', code: 'IN' },
    BD: { name: 'Bangladesh', flag: '🌍', code: 'BD' },
    US: { name: 'United States', flag: '🌍', code: 'US' },
    BR: { name: 'Brazil', flag: '🌍', code: 'BR' },
    RU: { name: 'Russia', flag: '🌍', code: 'RU' },
    AE: { name: 'Middle East', flag: '🌍', code: 'AE' },
    TR: { name: 'Turkey', flag: '🌍', code: 'TR' },
  }

  return regionMap[countryCode] || {
    name: 'Unknown Region',
    flag: '🌍',
    code: countryCode ?? 'XX',
  }
}

export default function MLRegionChecker() {
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const createCekRegionMutation = useMutation({
    mutationFn: checkRegionML,
    onSuccess: (data) => {
      console.log("Success data:", data);
      
      if (data.success) {
        // Get region info from country
        const regionInfo = getRegionInfo(data.country);
        
        // Set result dengan data lengkap
        setResult({
          nickname: data.nickname,
          userId: data.userId,
          serverId: data.serverId,
          country: data.country,
          region: regionInfo
        });
        
        toast.success(`Akun terverifikasi! Nickname: ${data.nickname}`);
      } else {
        setError("Gagal memvalidasi akun");
        toast.error("Gagal Cek Region");
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      setError(error.message || "Gagal memvalidasi akun. Periksa kembali User ID dan Server ID Anda.");
      toast.error(error.message || "Gagal Cek Region");
    },
  });

  const handleCheckRegion = async () => {
    // Reset state
    setError(null);
    setResult(null);

    // Validasi input
    if (!userId.trim()) {
      setError('User ID tidak boleh kosong');
      return;
    }
    if (!serverId.trim()) {
      setError('Server ID tidak boleh kosong');
      return;
    }

    // Validasi format (hanya angka)
    if (!/^\d+$/.test(userId)) {
      setError('User ID harus berupa angka');
      return;
    }
    if (!/^\d+$/.test(serverId)) {
      setError('Server ID harus berupa angka');
      return;
    }

    console.log("Checking region for:", { userId, serverId });
    
    try {
      await createCekRegionMutation.mutateAsync({ 
        userId: userId.trim(), 
        serverId: serverId.trim() 
      });
    } catch (err) {
      // Error sudah di-handle di onError
      console.error("Mutation error:", err);
    }
  };

  const handleReset = () => {
    setUserId('');
    setServerId('');
    setResult(null);
    setError(null);
  };

  const isLoading = createCekRegionMutation.isPending;
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <MapPin className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Cek Region Mobile Legends
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Validasi User ID dan Server ID untuk memastikan akun game Anda
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
          
          {/* Info Banner */}
          <div className="bg-blue-900/20 border-b border-blue-800/30 p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Cara menemukan ID Anda:</p>
                <p className="text-blue-400/80">
                  Buka Mobile Legends → Tap avatar di kiri atas → User ID dan Server ID akan terlihat di profil Anda
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              
              {/* User ID Input */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 123456789"
                  disabled={isLoading || result}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 disabled:bg-gray-800/50 disabled:cursor-not-allowed transition-all"
                />
              </div>

              {/* Server ID Input */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Server ID
                </label>
                <input
                  type="text"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 2163"
                  disabled={isLoading || result}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 disabled:bg-gray-800/50 disabled:cursor-not-allowed transition-all"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-900/20 border border-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-300">Validasi Gagal</p>
                    <p className="text-sm text-red-400 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Result */}
              {result && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Main Success Card */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-green-900/20 border border-green-800 shadow-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-300 mb-3">
                        Akun Terverifikasi ✓
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-green-800/30">
                          <span className="text-sm text-green-400">Nickname:</span>
                          <span className="text-sm font-semibold text-green-200">
                            {result.nickname}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-green-800/30">
                          <span className="text-sm text-green-400">User ID:</span>
                          <span className="text-sm font-mono font-semibold text-green-200">
                            {result.userId}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-green-400">Server ID:</span>
                          <span className="text-sm font-mono font-semibold text-green-200">
                            {result.serverId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Region Info Card */}
                  <div className="relative overflow-hidden rounded-xl border border-indigo-800/50 shadow-lg">
                    {/* Background linear */}
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-900/30 to-purple-900/30" />
                    
                    {/* Content */}
                    <div className="relative flex items-center gap-4 p-5">
                      <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl shrink-0 shadow-md">
                        {result.region.flag}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Region Server</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1.5">
                          {result.region.name}
                        </h3>
                        <p className="text-sm text-gray-300 font-medium">
                          Server Code: <span className="text-indigo-300 font-bold">{result.region.code}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!result ? (
                  <button
                    onClick={handleCheckRegion}
                    disabled={isLoading || !userId.trim() || !serverId.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed font-semibold transition-all shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Memvalidasi...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Cek Region</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Search className="w-5 h-5" />
                    <span>Cek Lagi</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          
          {/* Info Card 1 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-5 hover:border-indigo-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Aman & Terpercaya</h3>
                <p className="text-xs text-gray-400">
                  Validasi menggunakan API resmi Moogold untuk memastikan keakuratan data
                </p>
              </div>
            </div>
          </div>

          {/* Info Card 2 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-5 hover:border-purple-700/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Cepat & Akurat</h3>
                <p className="text-xs text-gray-400">
                  Proses validasi hanya memakan waktu beberapa detik
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" />
            Pertanyaan Umum
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-1">Kenapa perlu cek region?</h3>
              <p className="text-sm text-gray-400">
                Untuk memastikan top up diamond masuk ke akun yang tepat dan menghindari kesalahan pengiriman.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Apakah data saya aman?</h3>
              <p className="text-sm text-gray-400">
                Ya, kami hanya menggunakan data untuk validasi dan tidak menyimpan informasi pribadi Anda.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Bagaimana jika validasi gagal?</h3>
              <p className="text-sm text-gray-400">
                Pastikan User ID dan Server ID yang Anda masukkan sudah benar. Cek kembali di profil game Anda.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}