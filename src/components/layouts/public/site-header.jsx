"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/utils/auth-client";
import { Menu, Search } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();
  console.log(session?.user);

  return (
    <header
      className={`sticky top-0 z-40 bg-gray-900 border-b border-gray-800 text-white`}
    >
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center gap-4 flex-1">
          <button className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border-gray-700 border focus:outline-none focus:ring-2 focus:ring-indigo-600`}
            />
          </div>
        </div>
        {session?.user && (
          <div className="relative">
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="flex items-center gap-2 bg-blue-600 px-3 py-1.5 rounded-lg"
            >
              {session?.user?.profile ? (
                <img
                  src={session.user.profile}
                  className="w-6 h-6 rounded-full object-cover"
                  alt="profile"
                />
              ) : (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold uppercase">
                  {session?.user?.name?.charAt(0) || "?"}
                </div>
              )}
              <span className="text-sm font-medium">{session?.user.name}</span>
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                {/* Show Admin Menu if role admin */}
                {session?.user?.role === "admin" && (
                  <a
                    href="/admin"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Dashboard Admin
                  </a>
                )}

                {/* Logout */}
                <button
                  onClick={() => {
                    authClient.signOut();
                    router.push("/sign-in");
                  }}
                  className="mt-1 w-full text-left px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
