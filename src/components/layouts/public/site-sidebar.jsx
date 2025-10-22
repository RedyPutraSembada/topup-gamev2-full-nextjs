"use client";
import { Home, Gamepad2, CreditCard, List, HelpCircle, Users, Plus } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className={`fixed left-0 top-0 h-full w-48 bg-gray-800 border-r border-gray-700 z-50 hidden lg:block text-white`}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">GameVault</span>
        </div>

        <nav className="space-y-1">
          <div className="text-xs font-semibold text-gray-500 mb-2 px-3">MENU</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600 text-white">
            <Home className="w-4 h-4" />
            <span className="text-sm">Beranda</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-sm">Semua games</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Cek Transaksi</span>
          </button>

          <div className="text-xs font-semibold text-gray-500 mb-2 px-3 mt-6">NAVIGASI</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700">
            <List className="w-4 h-4" />
            <span className="text-sm">Daftar Layanan</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">FAQ</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700">
            <Users className="w-4 h-4" />
            <span className="text-sm">Dukungan Pelanggan</span>
          </button>

          <div className="text-xs font-semibold text-gray-500 mb-2 px-3 mt-6">PAYMENT</div>
          <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
            <span>*********1224</span>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 text-sm">
            <Plus className="w-4 h-4" />
            <span>Tambah Pembayaran</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}