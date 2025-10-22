"use client";
import { Menu, Search, Sun, Moon } from 'lucide-react';

export default function Header() {
  return (
    <header className={`sticky top-0 z-40 bg-gray-900 border-b border-gray-800 text-white`}>
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
        <div className="flex items-center gap-4">
          {/* <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-gray-700">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button> */}
          <div className="flex items-center gap-2 bg-green-600 px-3 py-1.5 rounded-lg">
            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Rp125,500</span>
          </div>
          <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
        </div>
      </div>
    </header>
  );
}