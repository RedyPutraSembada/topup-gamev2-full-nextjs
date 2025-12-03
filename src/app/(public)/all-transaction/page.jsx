"use client"
import { useState } from 'react';
import { Search, Filter, ChevronDown, Calendar, Receipt, Clock, CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetDataAllTransaction } from '@/data/public/all-transaction/all-transaction-datas';

export default function TransactionPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { data, isLoading, error, refetch } = useGetDataAllTransaction();
  
  console.log("data aall transaction", data);

  const statusFilters = [
    { id: 'all', name: 'Semua Status', icon: Receipt },
    { id: 'success', name: 'Berhasil', icon: CheckCircle },
    { id: 'pending', name: 'Pending', icon: Clock },
    { id: 'processing', name: 'Diproses', icon: RefreshCw },
    { id: 'failed', name: 'Gagal', icon: XCircle },
  ];

  // Transform API data to match component structure
  // const getGameName = (productCode) => {
  //   const gameMap = {
  //     'mobile_legends': 'Mobile Legends',
  //     'free_fire': 'Free Fire',
  //     'pubg': 'PUBG Mobile',
  //     'genshin': 'Genshin Impact',
  //   };
  //   return gameMap[productCode] || 'Game';
  // };

  const normalizeStatus = (status) => {
    const statusMap = {
      'Success': 'success',
      'Processing': 'processing',
      'pending': 'pending',
      'Failed': 'failed',
    };
    return statusMap[status] || 'pending';
  };

  const parseUserInput = (dataInputUser) => {
    try {
      return JSON.parse(dataInputUser);
    } catch {
      return {};
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const transactions = data?.data?.map(item => {
    const userInput = parseUserInput(item.data_input_user);
    const productName = userInput?.product?.kode || '';
    
    return {
      id: item.order_id,
      orderId: item.order_id,
      game: item.product_name,
      item: item.name_product_provider,
      amount: parseInt(item.total_amount) || 0,
      status: normalizeStatus(item.payment_progress),
      date: formatDate(item.date),
    };
  }) || [];

  const getStatusConfig = (status) => {
    const configs = {
      success: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Berhasil', Icon: CheckCircle },
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending', Icon: Clock },
      processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Diproses', Icon: RefreshCw },
      failed: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Gagal', Icon: XCircle },
    };
    return configs[status] || configs.pending;
  };

  const formatCurrency = (amt) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amt);

  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    if (selectedStatus !== 'all') filtered = filtered.filter(t => t.status === selectedStatus);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.orderId.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.game.toLowerCase().includes(q));
    }
    if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === 'oldest') filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === 'highest') filtered.sort((a, b) => b.amount - a.amount);
    else if (sortBy === 'lowest') filtered.sort((a, b) => a.amount - b.amount);
    return filtered;
  };

  const filtered = getFilteredTransactions();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

  const getStatusCount = (id) => id === 'all' ? transactions.length : transactions.filter(t => t.status === id).length;

  const handleFilterChange = (status) => { setSelectedStatus(status); setCurrentPage(1); };
  const handleSearchChange = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, '...', totalPages);
      else if (currentPage >= totalPages - 2) pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      else pages.push(1, '...', currentPage, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-400">Kelola dan pantau semua transaksi Anda</p>
        </div>

        {isLoading ? (
          <>
            {/* Loading Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-3 sm:p-4 animate-pulse">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-700 rounded w-12 mb-2"></div>
                      <div className="h-5 bg-gray-700 rounded w-8"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading Search & Filters */}
            <div className="space-y-3 mb-4">
              <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
              <div className="flex gap-3">
                <div className="flex-1 h-11 bg-gray-800 rounded-xl animate-pulse"></div>
                <div className="flex-1 h-11 bg-gray-800 rounded-xl animate-pulse"></div>
              </div>
              <div className="lg:hidden h-11 bg-gray-800 rounded-xl animate-pulse"></div>
            </div>

            <div className="flex gap-6">
              {/* Loading Sidebar - Desktop */}
              <aside className="hidden lg:block w-56 shrink-0">
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="h-5 bg-gray-700 rounded w-24 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-10 bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Loading Transaction List */}
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-800 rounded w-48 mb-3 animate-pulse"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="h-4 bg-gray-700 rounded w-20 ml-auto"></div>
                          <div className="h-3 bg-gray-700 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Gagal Memuat Data</h3>
              <p className="text-gray-400 mb-6">Terjadi kesalahan saat mengambil data transaksi</p>
              <button 
                onClick={() => refetch()}
                className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Coba Lagi
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              {[
                { label: 'Total', value: transactions.length, icon: Receipt, bg: 'bg-indigo-500/20', iconColor: 'text-indigo-400' },
                { label: 'Berhasil', value: transactions.filter(t => t.status === 'success').length, icon: CheckCircle, bg: 'bg-green-500/20', iconColor: 'text-green-400' },
                { label: 'Pending', value: transactions.filter(t => t.status === 'pending').length, icon: Clock, bg: 'bg-yellow-500/20', iconColor: 'text-yellow-400' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-2 rounded-lg ${s.bg}`}>
                      <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{s.label}</p>
                      <p className="text-lg sm:text-xl font-bold">{s.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search & Filters */}
            <div className="space-y-3 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Cari Order ID, Transaction ID, atau Game..."
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {/* Date Filter */}
                <div className="relative flex-1 min-w-[140px]">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Semua Waktu</option>
                    <option value="today">Hari Ini</option>
                    <option value="week">7 Hari</option>
                    <option value="month">30 Hari</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative flex-1 min-w-[140px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="highest">Tertinggi</option>
                    <option value="lowest">Terendah</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Status Filter - Mobile Dropdown */}
              <div className="lg:hidden relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={selectedStatus}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  {statusFilters.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({getStatusCount(s.id)})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-6">
              {/* Sidebar - Desktop */}
              <aside className="hidden lg:block w-56 shrink-0">
                <div className="bg-gray-800 rounded-xl p-4 sticky top-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4" />Filter Status
                  </h3>
                  <div className="space-y-1">
                    {statusFilters.map((s) => {
                      const Icon = s.icon;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleFilterChange(s.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                            selectedStatus === s.id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{s.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${selectedStatus === s.id ? 'bg-white/20' : 'bg-gray-700'}`}>
                            {getStatusCount(s.id)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* Transaction List */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-400 mb-3">
                  Menampilkan {filtered.length > 0 ? startIdx + 1 : 0}-{Math.min(startIdx + itemsPerPage, filtered.length)} dari {filtered.length} transaksi
                  {searchQuery && <span className="text-indigo-400"> untuk "{searchQuery}"</span>}
                </p>

                <div className="space-y-2 sm:space-y-3">
                  {paginated.map((t) => {
                    const status = getStatusConfig(t.status);
                    return (
                      <div key={t.id} className="bg-gray-800 rounded-xl p-3 sm:p-4 hover:bg-gray-800/80 transition-colors">
                        <div className="flex items-start sm:items-center gap-3">
                          {/* Game Avatar */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
                            {t.game.charAt(0)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                              {/* Left Info */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-sm sm:text-base truncate">{t.game}</h3>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bg} ${status.text}`}>
                                    <status.Icon className="w-3 h-3" />
                                    <span className="hidden xs:inline">{status.label}</span>
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 truncate">{t.item}</p>
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500">
                                  <span className="hidden sm:inline">Order: <span className="text-indigo-400 font-mono">{t.orderId}</span></span>
                                  <span className="sm:hidden text-indigo-400 font-mono">{t.orderId}</span>
                                  <span className="hidden md:inline font-mono">{t.id}</span>
                                </div>
                              </div>

                              {/* Right Info */}
                              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-1 sm:mt-0">
                                <div className="sm:text-right">
                                  <p className="font-bold text-sm sm:text-base">{formatCurrency(t.amount)}</p>
                                  <p className="text-xs text-gray-500">{t.date}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">📭</div>
                    <h3 className="text-lg font-bold mb-1">Transaksi tidak ditemukan</h3>
                    <p className="text-sm text-gray-400">Coba kata kunci lain atau ubah filter</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-6">
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
                      className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}