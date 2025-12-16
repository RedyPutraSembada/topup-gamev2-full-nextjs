"use client";
import { Home, Gamepad2, CreditCard, List, HelpCircle, Users, Plus, Newspaper, X, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({dataLogo, isOpen, onClose}) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  
  return (
    <>
      {/* Sidebar untuk Desktop - selalu tampil */}
      <aside className={`fixed left-0 top-0 h-full bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 z-50 hidden lg:block text-white shadow-2xl`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-700/50">
            {dataLogo ? (
              <div className="relative w-full h-12">
                <Link href={"/"}>
                  <Image
                    src={dataLogo.logo}
                    alt="Logo"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </Link>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <span className="font-bold text-xl bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">GameVault</span>
              </>
            )}
          </div>

          <nav className="space-y-2">
            <div className="text-xs font-bold text-slate-500 mb-4 px-3 tracking-wider">MENU</div>
            
            <Link
              href="/"
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <Home className={`w-5 h-5 ${isActive("/") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Home</span>
            </Link>

            <Link
              href="/all-product"
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/all-product") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/all-product") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <Gamepad2 className={`w-5 h-5 ${isActive("/all-product") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Semua games</span>
            </Link>

            <Link
              href="/all-transaction"
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/all-transaction") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/all-transaction") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <CreditCard className={`w-5 h-5 ${isActive("/all-transaction") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Cek Transaksi</span>
            </Link>

            <Link
              href="/all-news"
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/all-news") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/all-news") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <Newspaper className={`w-5 h-5 ${isActive("/all-news") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Berita</span>
            </Link>

            <Link
              href="/cek-region-mobile-legend"
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/cek-region-mobile-legend") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/cek-region-mobile-legend") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <Globe className={`w-5 h-5 ${isActive("/cek-region-mobile-legend") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Cek Region</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Sidebar untuk Mobile - toggle dengan tombol */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 z-50 lg:hidden text-white transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              {dataLogo ? (
                <div className="relative w-36 h-12">
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
                  <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xl bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">GameVault</span>
                </>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            <div className="text-xs font-bold text-slate-500 mb-4 px-3 tracking-wider">MENU</div>
            
            <Link
              href="/"
              onClick={onClose}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <Home className={`w-5 h-5 ${isActive("/") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Home</span>
            </Link>

            <Link
              href="/all-product"
              onClick={onClose}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/all-product") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/all-product") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <Gamepad2 className={`w-5 h-5 ${isActive("/all-product") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Semua games</span>
            </Link>

            <Link
              href="/all-transaction"
              onClick={onClose}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/all-transaction") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/all-transaction") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <CreditCard className={`w-5 h-5 ${isActive("/all-transaction") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Cek Transaksi</span>
            </Link>

            <Link
              href="/all-news"
              onClick={onClose}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/all-news") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/all-news") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <Newspaper className={`w-5 h-5 ${isActive("/all-news") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Berita</span>
            </Link>

            <Link
              href="/cek-region-mobile-legend"
              onClick={onClose}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive("/cek-region-mobile-legend") 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50" 
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"}
              `}
            >
              {isActive("/cek-region-mobile-legend") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <Globe className={`w-5 h-5 ${isActive("/cek-region-mobile-legend") ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm font-medium">Cek Region</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Overlay untuk mobile ketika sidebar terbuka */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}