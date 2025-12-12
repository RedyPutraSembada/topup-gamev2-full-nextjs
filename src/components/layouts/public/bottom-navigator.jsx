'use client'

import { Home, Gamepad2, CreditCard, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function BottomNavigator() {
  const pathname = usePathname()

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const navItems = [
    {
      title: 'Home',
      path: '/',
      icon: Home,
    },
    {
      title: 'Semua games',
      path: '/all-product',
      icon: Gamepad2,
    },
    {
      title: 'Logo', // Special item untuk logo
      path: '/',
      isLogo: true,
    },
    {
      title: 'Cek Transaksi',
      path: '/all-transaction',
      icon: CreditCard,
    },
    {
      title: 'Berita',
      path: '/all-news',
      icon: Newspaper,
    },
  ]

  return (
    <div className="sticky bottom-0 left-0 z-50 w-full h-16 bg-[#1e293b]/95 backdrop-blur-sm border-t border-white/10 shadow-[0_-2px_20px_rgba(0,0,0,0.3)] md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {navItems.map((item, idx) => {
          // Logo di tengah
          if (item.isLogo) {
            return (
              <Link
                key={idx}
                href={item.path}
                className="inline-flex flex-col items-center justify-center group -translate-y-6"
              >
                <div className="relative flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full shadow-[0_6px_20px_rgba(99,102,241,0.5)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 border-4 border-[#1e293b]">
                  {/* Logo Image - Ganti dengan logo Anda */}
                  <Image
                    src="/LOGO-ICON.png" // Ganti dengan path logo Anda
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  {/* Atau gunakan text jika tidak ada logo */}
                  {/* <span className="text-white font-bold text-xl">G</span> */}
                </div>
              </Link>
            )
          }

          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={idx}
              href={item.path}
              className={`inline-flex flex-col items-center justify-center group py-2 relative transition-all duration-200
                ${active ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'}
              `}
            >
              <div className="relative">
                <Icon
                  className={`h-6 w-6 transition-all duration-200 ${
                    active 
                      ? 'scale-110 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]' 
                      : 'group-hover:scale-105'
                  }`}
                />
                {/* Dot indicator saat active */}
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium transition-all duration-200 ${
                active ? 'text-indigo-400' : 'text-gray-400'
              }`}>
                {item.title}
              </span>
              {/* Underline indicator */}
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-linear-to-r from-transparent via-indigo-400 to-transparent rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}