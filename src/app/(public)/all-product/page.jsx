"use client";
import { useState } from 'react';
import { Search, Filter, Grid3x3, List, ChevronDown } from 'lucide-react';

export default function AllProductsPage() {
  const [darkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'Semua Game', count: 120, icon: '🎮' },
    { id: 'moba', name: 'MOBA', count: 15, icon: '⚔️' },
    { id: 'battle-royale', name: 'Battle Royale', count: 12, icon: '🔫' },
    { id: 'rpg', name: 'RPG', count: 25, icon: '🗡️' },
    { id: 'card', name: 'Card Game', count: 8, icon: '🃏' },
    { id: 'sports', name: 'Sports', count: 10, icon: '⚽' },
    { id: 'racing', name: 'Racing', count: 7, icon: '🏎️' },
    { id: 'casual', name: 'Casual', count: 18, icon: '🎲' },
    { id: 'strategy', name: 'Strategy', count: 14, icon: '♟️' },
    { id: 'voucher', name: 'Voucher & Wallet', count: 11, icon: '💰' },
  ];

  const products = {
    moba: [
      { id: 1, name: 'Mobile Legends', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&h=400&fit=crop', category: 'moba', price: 'Mulai Rp 15.000', popular: true },
      { id: 2, name: 'League of Legends: Wild Rift', image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=300&h=400&fit=crop', category: 'moba', price: 'Mulai Rp 20.000' },
      { id: 3, name: 'Arena of Valor', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400&fit=crop', category: 'moba', price: 'Mulai Rp 18.000' },
      { id: 4, name: 'Honor of Kings', image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&h=400&fit=crop', category: 'moba', price: 'Mulai Rp 22.000' },
      { id: 5, name: 'DOTA 2', image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=400&fit=crop', category: 'moba', price: 'Mulai Rp 25.000' },
    ],
    'battle-royale': [
      { id: 6, name: 'Free Fire', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&h=400&fit=crop', category: 'battle-royale', price: 'Mulai Rp 10.000', popular: true },
      { id: 7, name: 'PUBG Mobile', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop', category: 'battle-royale', price: 'Mulai Rp 15.000', popular: true },
      { id: 8, name: 'Call of Duty Mobile', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400&fit=crop', category: 'battle-royale', price: 'Mulai Rp 20.000' },
      { id: 9, name: 'Apex Legends Mobile', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop', category: 'battle-royale', price: 'Mulai Rp 18.000' },
    ],
    rpg: [
      { id: 10, name: 'Genshin Impact', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400&fit=crop', category: 'rpg', price: 'Mulai Rp 16.000', popular: true },
      { id: 11, name: 'Honkai Star Rail', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400&fit=crop', category: 'rpg', price: 'Mulai Rp 16.000', popular: true },
      { id: 12, name: 'Zenless Zone Zero', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop', category: 'rpg', price: 'Mulai Rp 16.000' },
      { id: 13, name: 'Wuthering Waves', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop', category: 'rpg', price: 'Mulai Rp 16.000' },
      { id: 14, name: 'Tower of Fantasy', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop', category: 'rpg', price: 'Mulai Rp 15.000' },
      { id: 15, name: 'Honkai Impact 3rd', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop', category: 'rpg', price: 'Mulai Rp 15.000' },
    ],
    card: [
      { id: 16, name: 'Yu-Gi-Oh! Master Duel', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=400&fit=crop', category: 'card', price: 'Mulai Rp 12.000' },
      { id: 17, name: 'Marvel Snap', image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=300&h=400&fit=crop', category: 'card', price: 'Mulai Rp 15.000' },
      { id: 18, name: 'Magic Chess', image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=400&fit=crop', category: 'card', price: 'Mulai Rp 10.000' },
    ],
    racing: [
      { id: 19, name: 'Racing Master', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop', category: 'racing', price: 'Mulai Rp 20.000' },
      { id: 20, name: 'Asphalt 9', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&h=400&fit=crop', category: 'racing', price: 'Mulai Rp 18.000' },
    ],
    voucher: [
      { id: 21, name: 'Google Play', image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&h=400&fit=crop', category: 'voucher', price: 'Mulai Rp 10.000' },
      { id: 22, name: 'Apple iTunes', image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=400&fit=crop', category: 'voucher', price: 'Mulai Rp 15.000' },
      { id: 23, name: 'Steam Wallet', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop', category: 'voucher', price: 'Mulai Rp 12.000' },
    ],
  };

  // Get filtered products
  const getFilteredProducts = () => {
    let allProducts = [];
    
    if (selectedCategory === 'all') {
      Object.values(products).forEach(category => {
        allProducts = [...allProducts, ...category];
      });
    } else {
      allProducts = products[selectedCategory] || [];
    }

    // Filter by search
    if (searchQuery) {
      allProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    if (sortBy === 'popular') {
      allProducts.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === 'name') {
      allProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    return allProducts;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Semua Produk</h1>
          <p className="text-sm sm:text-base text-gray-400">Temukan game favorit Anda dan top up dengan mudah</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game..."
                className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 focus:border-indigo-600'
                    : 'bg-white border-gray-300 focus:border-indigo-600'
                } focus:outline-none focus:ring-2 focus:ring-indigo-600/20`}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`appearance-none pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 focus:border-indigo-600'
                  : 'bg-white border-gray-300 focus:border-indigo-600'
              } focus:outline-none focus:ring-2 focus:ring-indigo-600/20 cursor-pointer`}
            >
              <option value="popular">Paling Populer</option>
              <option value="name">Nama A-Z</option>
              <option value="newest">Terbaru</option>
            </select>
            <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className={`flex gap-2 p-1 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Category Dropdown */}
        <div className="lg:hidden mb-4 sm:mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border ${
              darkMode
                ? 'bg-gray-800 border-gray-700 focus:border-indigo-600'
                : 'bg-white border-gray-300 focus:border-indigo-600'
            } focus:outline-none focus:ring-2 focus:ring-indigo-600/20`}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Categories - Desktop Only */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 sticky top-24`}>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Kategori
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : darkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-white/20'
                        : darkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-400">
                Menampilkan {filteredProducts.length} produk
                {searchQuery && ` untuk "${searchQuery}"`}
              </p>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-2 sm:mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.popular && (
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-yellow-500 text-black text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                          Popular
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                          <p className="text-xs sm:text-sm font-medium text-white mb-0.5 sm:mb-1 line-clamp-2">{product.name}</p>
                          <p className="text-[10px] sm:text-xs text-gray-300">{product.price}</p>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1 px-0.5">{product.name}</h3>
                    <p className="text-[10px] sm:text-xs text-indigo-400 px-0.5">{product.price}</p>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-3 sm:space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                    } transition-colors cursor-pointer`}
                  >
                    <div className="w-20 sm:w-24 h-28 sm:h-32 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-base sm:text-lg mb-0.5 sm:mb-1 truncate">{product.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-400 capitalize">
                            {categories.find(c => c.id === product.category)?.name}
                          </p>
                        </div>
                        {product.popular && (
                          <span className="bg-yellow-500 text-black text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-indigo-400 font-semibold text-sm sm:text-base mb-2 sm:mb-3">{product.price}</p>
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                        Top Up Sekarang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Produk tidak ditemukan</h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Coba kata kunci lain atau pilih kategori berbeda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}