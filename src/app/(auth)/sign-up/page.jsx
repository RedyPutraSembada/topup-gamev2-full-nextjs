"use client";
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [darkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', formData);
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left Section - Image */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-purple-600 to-indigo-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">Bergabung dengan GameVault</h2>
          <p className="text-lg text-purple-100 mb-8">
            Nikmati pengalaman top up game yang mudah, cepat, dan aman dengan berbagai promo menarik
          </p>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold mb-1">Proses Cepat</h3>
              <p className="text-sm text-purple-200">Diamond masuk dalam 1-5 menit</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-bold mb-1">100% Aman</h3>
              <p className="text-sm text-purple-200">Transaksi terjamin dan terpercaya</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="font-bold mb-1">Harga Terbaik</h3>
              <p className="text-sm text-purple-200">Dapatkan bonus dan promo setiap hari</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              GameVault
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Buat Akun Baru
            </h1>
            <p className="text-gray-400">
              Daftar untuk mulai top up game favorit Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-600'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-600/20`}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-600'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-600/20`}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08123456789"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-600'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-600/20`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-600'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-600/20`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-600'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-600'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-600/20`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 rounded border-gray-600 text-indigo-600 focus:ring-indigo-600"
                required
              />
              <span className="text-sm text-gray-400">
                Saya menyetujui{' '}
                <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
                  Syarat & Ketentuan
                </Link>
                {' '}dan{' '}
                <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                  Kebijakan Privasi
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Daftar Sekarang
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}