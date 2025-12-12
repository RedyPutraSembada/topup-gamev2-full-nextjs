"use client";
import { authClient } from "@/utils/auth-client";
import { Menu, Gamepad2, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Header({ dataLogo, onMenuClick }) {
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  // Close menu when click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setOpenMenu(false);
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 text-white">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Left Section - Logo & Menu Button */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo - hanya tampil di mobile */}
          {dataLogo ? (
            <div className="relative w-32 h-10 lg:hidden">
              <Image
                src={dataLogo.logo}
                alt="Logo"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">GameVault</span>
            </div>
          )}
        </div>

        {/* Right Section - Auth Buttons */}
        <div className="flex items-center gap-3">
          {isPending ? (
            // Loading state
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg animate-pulse">
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              <div className="w-20 h-4 bg-gray-700 rounded hidden sm:block"></div>
            </div>
          ) : session?.user ? (
            // Logged in state
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {/* Avatar */}
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white/20"
                    alt="profile"
                  />
                ) : (
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold uppercase ring-2 ring-white/20">
                    {session?.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                
                {/* Name - hidden on mobile */}
                <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">
                  {session?.user.name}
                </span>
                
                {/* Dropdown icon */}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 hidden sm:block ${
                    openMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {openMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {session?.user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {/* Admin Dashboard - only for admin */}
                    {session?.user?.role === "admin" && (
                      <a
                        href="/admin"
                        onClick={() => setOpenMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        <span>Dashboard Admin</span>
                      </a>
                    )}

                    {/* Profile */}
                    {/* <a
                      href="/profile"
                      onClick={() => setOpenMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-400" />
                      <span>Profil Saya</span>
                    </a> */}
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-gray-700 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Not logged in state
            <div className="flex items-center gap-2">
              {/* <button
                onClick={() => router.push("/sign-in")}
                className="px-4 py-2 text-sm font-medium text-white hover:text-gray-200 transition-colors"
              >
                Masuk
              </button> */}
              <button
                onClick={() => router.push("/sign-in")}
                className="px-4 py-2 text-sm font-medium bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}