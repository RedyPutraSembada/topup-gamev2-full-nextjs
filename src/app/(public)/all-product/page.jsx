"use client";
import { useState, useMemo } from 'react';
import { Search, Filter, Grid3x3, List, ChevronDown, Loader2 } from 'lucide-react';
import { useGetDataAllProduct } from '@/data/public/all-product/all-product-datas';
import Link from 'next/link';
import Image from 'next/image';

// Mock hook untuk demo - ganti dengan hook asli Anda
// const useGetDataAllProduct = () => {
//   // Simulasi data dari API
//   const mockData = {
//     data: [
//       {
//         id: 1,
//         title: "Mobile Legend",
//         slug: "mobile-legend",
//         category_name: "Game",
//         image_thumbnail: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&h=400&fit=crop",
//         image_cover: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&h=400&fit=crop",
//         description: "Beli Top Up Diamond MLBB Termurah",
//         best_seller: 1,
//         is_active: 1,
//         type_product_id: 1
//       },
//       {
//         id: 2,
//         title: "Netflix",
//         slug: "netflix",
//         category_name: "Account Premium",
//         image_thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop",
//         image_cover: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop",
//         description: "Description Netflix",
//         best_seller: 0,
//         is_active: 1,
//         type_product_id: 2
//       },
//       {
//         id: 3,
//         title: "Free Fire",
//         slug: "free-fire",
//         category_name: "Game",
//         image_thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400&fit=crop",
//         image_cover: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400&fit=crop",
//         description: "Deskripsi Free Fire",
//         best_seller: 0,
//         is_active: 1,
//         type_product_id: 1
//       }
//     ]
//   };
  
//   return {
//     data: mockData,
//     error: null,
//     isLoading: false,
//     refetch: () => {}
//   };
// };

export default function AllProductsPage() {
  const [darkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  
  const { data, error, isLoading, refetch } = useGetDataAllProduct();

  // Extract categories from products data
  const categories = useMemo(() => {
    if (!data?.data) return [{ id: 'all', name: 'Semua Produk', count: 0, icon: '🎮' }];
    
    const categoryMap = new Map();
    categoryMap.set('all', { id: 'all', name: 'Semua Produk', count: data.data.length, icon: '🎮' });
    
    data.data.forEach(product => {
      const categoryName = product.category_name;
      if (categoryMap.has(categoryName)) {
        categoryMap.get(categoryName).count++;
      } else {
        // Set icon based on category
        let icon = '📦';
        if (categoryName.toLowerCase().includes('game')) icon = '🎮';
        else if (categoryName.toLowerCase().includes('premium') || categoryName.toLowerCase().includes('account')) icon = '⭐';
        else if (categoryName.toLowerCase().includes('voucher')) icon = '💰';
        
        categoryMap.set(categoryName, {
          id: categoryName,
          name: categoryName,
          count: 1,
          icon: icon
        });
      }
    });
    
    return Array.from(categoryMap.values());
  }, [data]);

  // Get filtered and sorted products
  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    
    let products = [...data.data].filter(product => product.is_active === 1);
    
    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter(product => product.category_name === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category_name.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    if (sortBy === 'popular') {
      products.sort((a, b) => b.best_seller - a.best_seller);
    } else if (sortBy === 'name') {
      products.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'newest') {
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return products;
  }, [data, selectedCategory, searchQuery, sortBy]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg">Memuat produk...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-400 mb-4">Gagal memuat data produk</p>
          <button 
            onClick={refetch}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

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
                  <Link href={`/product/${product.slug}`}>
                    <div key={product.id} className="group cursor-pointer">
                      <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-2 sm:mb-3">
                        <Image
                          src={product.image_thumbnail || product.image_cover}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop';
                          }}
                        />
                        {product.best_seller === 1 && (
                          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-yellow-500 text-black text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg z-10">
                            Popular
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-5">
                          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                            <p className="text-xs sm:text-sm font-medium text-white mb-0.5 sm:mb-1 line-clamp-2">{product.title}</p>
                            <p className="text-[10px] sm:text-xs text-gray-300">{product.category_name}</p>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-medium text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1 px-0.5">{product.title}</h3>
                      <p className="text-[10px] sm:text-xs text-indigo-400 px-0.5">{product.category_name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-3 sm:space-y-4">
                {filteredProducts.map((product) => (
                  <Link href={`/product/${product.slug}`}>
                    <div
                      key={product.id}
                      className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                      } transition-colors cursor-pointer`}
                    >
                      <div className="relative w-20 sm:w-24 h-28 sm:h-32 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={product.image_thumbnail || product.image_cover}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 80px, 96px"
                          className="object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                          <div className="min-w-0">
                            <h3 className="font-bold text-base sm:text-lg mb-0.5 sm:mb-1 truncate">{product.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-400">
                              {product.category_name}
                            </p>
                          </div>
                          {product.best_seller === 1 && (
                            <span className="bg-yellow-500 text-black text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{product.description}</p>
                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                          Top Up Sekarang
                        </button>
                      </div>
                    </div>
                  </Link>
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