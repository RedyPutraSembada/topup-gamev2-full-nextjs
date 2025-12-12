"use client";
import { Home, Gamepad2, CreditCard, List, HelpCircle, Users, Plus, Newspaper, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar({dataLogo, isOpen, onClose}) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  
  return (
    <>
      {/* Sidebar untuk Desktop - selalu tampil */}
      <aside className={`fixed left-0 top-0 h-full w-48 bg-gray-800 border-r border-gray-700 z-50 hidden lg:block text-white`}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            {dataLogo ? (
              <div className="relative w-full h-10">
                <Image
                  src={dataLogo.logo}
                  alt="Logo"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            ) : (
              <>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">GameVault</span>
              </>
            )}
          </div>

          <nav className="space-y-1">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-3">MENU</div>
            <a
              href="/"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                ${isActive("/") ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}
              `}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </a>
            <a
              href="/all-product"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                ${isActive("/all-product") ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}
              `}
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm">Semua games</span>
            </a>
            <a
              href="/all-transaction"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                ${isActive("/all-transaction") ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}
              `}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">Cek Transaksi</span>
            </a>
            <a
              href="/all-news"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                ${isActive("/all-news") ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}
              `}
            >
              <Newspaper className="w-4 h-4" />
              <span className="text-sm">Berita</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Sidebar untuk Mobile - toggle dengan tombol */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-50 lg:hidden text-white transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {dataLogo ? (
                <div className="relative w-32 h-10">
                  <Image
                    src={dataLogo.logo}
                    alt="Logo"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg">GameVault</span>
                </>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-3">MENU</div>
            <a
              href="/"
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                ${isActive("/") ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}
              `}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </a>
            <a
              href="/all-product"
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                ${isActive("/all-product") ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}
              `}
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm">Semua games</span>
            </a>
            <a
              href="/all-transaction"
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                ${isActive("/all-transaction") ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}
              `}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">Cek Transaksi</span>
            </a>
            <a
              href="/all-news"
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                ${isActive("/all-news") ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}
              `}
            >
              <Newspaper className="w-4 h-4" />
              <span className="text-sm">Berita</span>
            </a>
          </nav>
        </div>
      </aside>
    </>
  );
}