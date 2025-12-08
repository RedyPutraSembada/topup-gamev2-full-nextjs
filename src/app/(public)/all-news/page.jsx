"use client"
import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, Calendar, Clock, ChevronLeft, ChevronRight, BookOpen, Tag } from 'lucide-react';
import { useGetDataAllNews } from '@/data/public/all-news/all-news-datas';

// Mock hook untuk demo - ganti dengan hook asli Anda
// const useGetDataAllNews = () => {
//   const mockData = {
//     data: [
//       {
//         id: 3,
//         title: "Ada pelatihan untuk kampus juga",
//         content: "[{\"id\":\"0a3627bf-712b-4ee1-b1cd-7454e26b33e4\",\"type\":\"heading\",\"props\":{\"backgroundColor\":\"rgb(255, 255, 255)\",\"textColor\":\"rgb(0, 0, 0)\",\"textAlignment\":\"left\",\"level\":2,\"isToggleable\":false},\"content\":[{\"type\":\"text\",\"text\":\"Where does it come from?\",\"styles\":{}}],\"children\":[]}]",
//         slug: "ada-pelatihan-untuk-kampus-juga",
//         image_hero: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
//         date: "2025-12-01T22:21:00.000Z",
//         tags: "[{\"name\":\"Kampus\",\"order\":1},{\"name\":\"Pelatihan\",\"order\":2}]",
//         is_active: 1,
//         created_at: "2025-12-08T22:21:40.000Z",
//         updated_at: "2025-12-08T22:21:40.000Z"
//       },
//       {
//         id: 2,
//         title: "berita terbaru ML",
//         content: "[{\"id\":\"7343f104-6b4a-45da-bde7-ef6f36d02d4e\",\"type\":\"heading\"}]",
//         slug: "berita-terbaru-ml",
//         image_hero: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
//         date: "2025-12-05T22:20:00.000Z",
//         tags: "[{\"name\":\"ML\",\"order\":1},{\"name\":\"Game\",\"order\":2}]",
//         is_active: 1,
//         created_at: "2025-12-08T22:20:57.000Z",
//         updated_at: "2025-12-08T22:20:57.000Z"
//       },
//       {
//         id: 1,
//         title: "Netflix berita",
//         content: "[{\"id\":\"097beb5d-8556-4dc0-8f85-ee67128b7edf\",\"type\":\"heading\"}]",
//         slug: "netflix-berita-",
//         image_hero: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop",
//         date: "2025-12-08T22:09:00.000Z",
//         tags: "[{\"name\":\"net\",\"order\":1},{\"name\":\"flix\",\"order\":2}]",
//         is_active: 1,
//         created_at: "2025-12-08T22:14:38.000Z",
//         updated_at: "2025-12-08T22:14:38.000Z"
//       }
//     ],
//     success: true
//   };
  
//   return { 
//     data: mockData, 
//     error: null, 
//     isLoading: false, 
//     refetch: () => {} 
//   };
// };

export default function AllNewsPage() {
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: response, error, isLoading, refetch } = useGetDataAllNews();

  // Parse dan extract data dari response
  const articles = useMemo(() => {
    if (!response?.data) return [];
    
    return response.data
      .filter(item => item.is_active === 1)
      .map(item => {
        // Parse tags
        let parsedTags = [];
        try {
          parsedTags = JSON.parse(item.tags || '[]');
        } catch (e) {
          console.error('Error parsing tags:', e);
        }

        // Extract excerpt dari content
        let excerpt = '';
        try {
          const contentArray = JSON.parse(item.content || '[]');
          const paragraph = contentArray.find(block => block.type === 'paragraph');
          if (paragraph?.content?.[0]?.text) {
            excerpt = paragraph.content[0].text.substring(0, 150) + '...';
          }
        } catch (e) {
          excerpt = 'Baca artikel lengkap untuk mengetahui lebih lanjut...';
        }

        // Estimate read time berdasarkan content length
        const contentLength = item.content?.length || 0;
        const readTime = Math.max(3, Math.ceil(contentLength / 1000)) + ' min';

        return {
          id: item.id,
          title: item.title,
          excerpt,
          image: item.image_hero,
          slug: item.slug,
          tags: parsedTags,
          date: item.date,
          readTime,
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      });
  }, [response]);

  // Extract semua tags unik dari artikel
  const allTags = useMemo(() => {
    const tagSet = new Set();
    articles.forEach(article => {
      article.tags.forEach(tag => {
        if (tag.name && tag.name.trim()) {
          tagSet.add(tag.name.trim());
        }
      });
    });
    return Array.from(tagSet).sort();
  }, [articles]);

  // Build categories dari tags
  const categories = useMemo(() => {
    const cats = [
      { id: 'all', name: 'Semua Artikel', icon: BookOpen }
    ];
    
    allTags.forEach(tag => {
      cats.push({
        id: tag.toLowerCase(),
        name: tag,
        icon: Tag
      });
    });
    
    return cats;
  }, [allTags]);

  // Filter dan sort artikel
  const getFilteredArticles = () => {
    let filtered = [...articles];
    
    // Filter berdasarkan tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(article => 
        article.tags.some(tag => tag.name.trim().toLowerCase() === selectedTag)
      );
    }
    
    // Filter berdasarkan search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(q) || 
        article.excerpt.toLowerCase().includes(q)
      );
    }
    
    // Sort artikel
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'popular') {
      // Bisa disesuaikan dengan metric popularity Anda
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return filtered;
  };

  const filtered = getFilteredArticles();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);
  const featuredArticle = filtered[0]; // Artikel pertama sebagai featured

  const getCategoryCount = (id) => {
    if (id === 'all') return articles.length;
    return articles.filter(article => 
      article.tags.some(tag => tag.name.trim().toLowerCase() === id)
    ).length;
  };

  const handleFilterChange = (tag) => { 
    setSelectedTag(tag); 
    setCurrentPage(1); 
  };
  
  const handleSearchChange = (e) => { 
    setSearchQuery(e.target.value); 
    setCurrentPage(1); 
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getTagColors = () => {
    const colors = [
      'bg-blue-500/20 text-blue-400',
      'bg-green-500/20 text-green-400',
      'bg-orange-500/20 text-orange-400',
      'bg-purple-500/20 text-purple-400',
      'bg-pink-500/20 text-pink-400',
      'bg-yellow-500/20 text-yellow-400',
      'bg-red-500/20 text-red-400',
      'bg-indigo-500/20 text-indigo-400',
    ];
    const index = allTags.indexOf(selectedTag) % colors.length;
    return colors[index] || 'bg-gray-500/20 text-gray-400';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Gagal memuat artikel</h3>
          <p className="text-gray-400 mb-4">Terjadi kesalahan saat mengambil data</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Artikel & Berita</h1>
          <p className="text-sm text-gray-400">
            Informasi terbaru seputar dunia game, panduan, dan promo menarik
          </p>
        </div>

        {/* Featured Article */}
        {featuredArticle && selectedTag === 'all' && !searchQuery && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 h-48 sm:h-64 lg:h-auto">
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="lg:w-1/2 p-4 sm:p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                    Featured
                  </span>
                  {featuredArticle.tags.slice(0, 2).map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(featuredArticle.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTime}
                  </span>
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
                value={selectedTag}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({getCategoryCount(c.id)})
                  </option>
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
                <Filter className="w-4 h-4" />Tags
              </h3>
              <div className="space-y-1">
                {categories.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleFilterChange(c.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                        selectedTag === c.id 
                          ? 'bg-indigo-600 text-white' 
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedTag === c.id ? 'bg-white/20' : 'bg-gray-700'
                      }`}>
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
                <article 
                  key={article.id} 
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors group cursor-pointer"
                >
                  <div className="relative h-40 sm:h-44 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      {article.tags.slice(0, 2).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900/80 text-gray-200 backdrop-blur-sm"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(article.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
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
                <p className="text-sm text-gray-400">
                  Coba kata kunci lain atau pilih tag berbeda
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1 
                      ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {getPageNumbers().map((p, i) => (
                  <button
                    key={i}
                    onClick={() => typeof p === 'number' && setCurrentPage(p)}
                    disabled={p === '...'}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      p === currentPage 
                        ? 'bg-indigo-600 text-white' 
                        : p === '...' 
                        ? 'bg-transparent text-gray-500 cursor-default' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages 
                      ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
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