"use client"
import { useState } from 'react';
import { Search, Filter, ChevronDown, Calendar, Clock, ChevronLeft, ChevronRight, TrendingUp, Gamepad2, Gift, Users, BookOpen } from 'lucide-react';

export default function AllArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    { id: 'all', name: 'Semua Artikel', icon: BookOpen },
    { id: 'news', name: 'Berita Game', icon: TrendingUp },
    { id: 'guide', name: 'Panduan', icon: Gamepad2 },
    { id: 'promo', name: 'Promo & Event', icon: Gift },
    { id: 'community', name: 'Komunitas', icon: Users },
  ];

  const articles = [
    { id: 1, title: 'Update Terbaru Mobile Legends: Hero Baru dan Revamp', excerpt: 'Moonton resmi mengumumkan hero baru yang akan hadir di update patch mendatang beserta beberapa revamp hero lama.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop', category: 'news', date: '2024-11-22', readTime: '5 min', featured: true },
    { id: 2, title: 'Panduan Lengkap Build Hero Ling Season 32', excerpt: 'Pelajari build terbaik untuk hero Ling di season ini agar rank push makin mudah dan efektif.', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop', category: 'guide', date: '2024-11-21', readTime: '8 min', featured: true },
    { id: 3, title: 'Promo Top Up Double Diamond Spesial 11.11', excerpt: 'Dapatkan bonus diamond hingga 100% untuk setiap pembelian selama periode promo berlangsung.', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop', category: 'promo', date: '2024-11-20', readTime: '3 min', featured: false },
    { id: 4, title: 'Genshin Impact 4.3: Karakter Baru dan Area Fontaine', excerpt: 'Update versi 4.3 membawa dua karakter baru dan perluasan area eksplorasi di region Fontaine.', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop', category: 'news', date: '2024-11-19', readTime: '6 min', featured: false },
    { id: 5, title: 'Tips Pro Player: Cara Rotasi yang Benar di MOBA', excerpt: 'Pelajari teknik rotasi yang digunakan pro player untuk mendominasi early game.', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600&h=400&fit=crop', category: 'guide', date: '2024-11-18', readTime: '10 min', featured: false },
    { id: 6, title: 'Komunitas Gamer Indonesia Gelar Turnamen Amal', excerpt: 'Event gaming untuk kemanusiaan berhasil mengumpulkan donasi untuk korban bencana.', image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=600&h=400&fit=crop', category: 'community', date: '2024-11-17', readTime: '4 min', featured: false },
    { id: 7, title: 'Free Fire x One Piece: Kolaborasi Epic Hadir!', excerpt: 'Garena mengumumkan kolaborasi spektakuler dengan anime populer One Piece.', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop', category: 'news', date: '2024-11-16', readTime: '4 min', featured: false },
    { id: 8, title: 'Cara Mendapatkan Skin Gratis di PUBG Mobile', excerpt: 'Ikuti langkah-langkah ini untuk mendapatkan skin permanen tanpa harus top up.', image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&h=400&fit=crop', category: 'guide', date: '2024-11-15', readTime: '5 min', featured: false },
    { id: 9, title: 'Cashback 50% Top Up Semua Game Akhir Tahun', excerpt: 'Promo spesial akhir tahun dengan cashback besar-besaran untuk semua metode pembayaran.', image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&h=400&fit=crop', category: 'promo', date: '2024-11-14', readTime: '2 min', featured: false },
    { id: 10, title: 'Honkai Star Rail 2.0: Semua yang Perlu Kamu Tahu', excerpt: 'Update besar membawa cerita baru, karakter, dan sistem gameplay yang diperbarui.', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&h=400&fit=crop', category: 'news', date: '2024-11-13', readTime: '7 min', featured: false },
  ];

  const getCategoryInfo = (catId) => categories.find(c => c.id === catId) || categories[0];

  const getFilteredArticles = () => {
    let filtered = [...articles];
    if (selectedCategory !== 'all') filtered = filtered.filter(a => a.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
    }
    if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === 'oldest') filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === 'popular') filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return filtered;
  };

  const filtered = getFilteredArticles();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);
  const featuredArticle = articles.find(a => a.featured);

  const getCategoryCount = (id) => id === 'all' ? articles.length : articles.filter(a => a.category === id).length;

  const handleFilterChange = (cat) => { setSelectedCategory(cat); setCurrentPage(1); };
  const handleSearchChange = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) for (let i = 1; i <= totalPages; i++) pages.push(i);
    else {
      if (currentPage <= 3) pages.push(1, 2, 3, '...', totalPages);
      else if (currentPage >= totalPages - 2) pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      else pages.push(1, '...', currentPage, '...', totalPages);
    }
    return pages;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getCategoryStyle = (catId) => {
    const styles = {
      news: 'bg-blue-500/20 text-blue-400',
      guide: 'bg-green-500/20 text-green-400',
      promo: 'bg-orange-500/20 text-orange-400',
      community: 'bg-purple-500/20 text-purple-400',
    };
    return styles[catId] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Artikel & Berita</h1>
          <p className="text-sm text-gray-400">Informasi terbaru seputar dunia game, panduan, dan promo menarik</p>
        </div>

        {/* Featured Article */}
        {featuredArticle && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 h-48 sm:h-64 lg:h-auto">
                <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover" />
              </div>
              <div className="lg:w-1/2 p-4 sm:p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">Featured</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(featuredArticle.category)}`}>
                    {getCategoryInfo(featuredArticle.category).name}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">{featuredArticle.title}</h2>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{featuredArticle.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(featuredArticle.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featuredArticle.readTime}</span>
                </div>
                <button className="self-start px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors">
                  Baca Selengkapnya
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari artikel..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 sm:flex-none sm:w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="popular">Populer</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Mobile Category Filter */}
            <div className="lg:hidden relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({getCategoryCount(c.id)})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-gray-800 rounded-xl p-4 sticky top-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                <Filter className="w-4 h-4" />Kategori
              </h3>
              <div className="space-y-1">
                {categories.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleFilterChange(c.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                        selectedCategory === c.id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{c.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === c.id ? 'bg-white/20' : 'bg-gray-700'}`}>
                        {getCategoryCount(c.id)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Articles Grid */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              Menampilkan {filtered.length > 0 ? startIdx + 1 : 0}-{Math.min(startIdx + itemsPerPage, filtered.length)} dari {filtered.length} artikel
              {searchQuery && <span className="text-indigo-400"> untuk "{searchQuery}"</span>}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginated.map((article) => (
                <article key={article.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors group cursor-pointer">
                  <div className="relative h-40 sm:h-44 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(article.category)}`}>
                        {getCategoryInfo(article.category).name}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mb-3 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />{formatDate(article.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />{article.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📰</div>
                <h3 className="text-lg font-bold mb-1">Artikel tidak ditemukan</h3>
                <p className="text-sm text-gray-400">Coba kata kunci lain atau pilih kategori berbeda</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {getPageNumbers().map((p, i) => (
                  <button
                    key={i}
                    onClick={() => typeof p === 'number' && setCurrentPage(p)}
                    disabled={p === '...'}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      p === currentPage ? 'bg-indigo-600 text-white' : p === '...' ? 'bg-transparent text-gray-500 cursor-default' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}