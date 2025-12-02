"use client"
import { useState } from 'react';
import { Search, Filter, ChevronDown, Calendar, Receipt, Clock, CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TransactionPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statusFilters = [
    { id: 'all', name: 'Semua Status', icon: Receipt },
    { id: 'success', name: 'Berhasil', icon: CheckCircle },
    { id: 'pending', name: 'Pending', icon: Clock },
    { id: 'processing', name: 'Diproses', icon: RefreshCw },
    { id: 'failed', name: 'Gagal', icon: XCircle },
  ];

  const transactions = [
    { id: 'TRX-20241122-001', orderId: 'ORD-8829104', game: 'Mobile Legends', item: '257 Diamonds', amount: 49000, status: 'success', date: '2024-11-22 14:30' },
    { id: 'TRX-20241122-002', orderId: 'ORD-8829105', game: 'Genshin Impact', item: 'Welkin Moon', amount: 75000, status: 'success', date: '2024-11-22 13:15' },
    { id: 'TRX-20241122-003', orderId: 'ORD-8829106', game: 'Free Fire', item: '720 Diamonds', amount: 99000, status: 'pending', date: '2024-11-22 12:45' },
    { id: 'TRX-20241122-004', orderId: 'ORD-8829107', game: 'PUBG Mobile', item: '660 UC', amount: 159000, status: 'processing', date: '2024-11-22 11:20' },
    { id: 'TRX-20241122-005', orderId: 'ORD-8829108', game: 'Honkai Star Rail', item: '300+30 Oneiric Shard', amount: 79000, status: 'failed', date: '2024-11-22 10:00' },
    { id: 'TRX-20241121-001', orderId: 'ORD-8829099', game: 'Mobile Legends', item: '568 Diamonds', amount: 99000, status: 'success', date: '2024-11-21 22:30' },
    { id: 'TRX-20241121-002', orderId: 'ORD-8829100', game: 'Valorant', item: '1000 VP', amount: 149000, status: 'success', date: '2024-11-21 20:15' },
    { id: 'TRX-20241121-003', orderId: 'ORD-8829101', game: 'Call of Duty Mobile', item: '880 CP', amount: 169000, status: 'pending', date: '2024-11-21 18:45' },
    { id: 'TRX-20241120-001', orderId: 'ORD-8829090', game: 'Zenless Zone Zero', item: '300 Polychrome', amount: 79000, status: 'success', date: '2024-11-20 16:20' },
    { id: 'TRX-20241120-002', orderId: 'ORD-8829091', game: 'Honkai Impact 3rd', item: '330 Crystals', amount: 79000, status: 'success', date: '2024-11-20 14:10' },
    { id: 'TRX-20241120-003', orderId: 'ORD-8829092', game: 'Arena of Valor', item: '500 Vouchers', amount: 99000, status: 'failed', date: '2024-11-20 12:00' },
    { id: 'TRX-20241119-001', orderId: 'ORD-8829080', game: 'League of Legends Wild Rift', item: '1000 Wild Cores', amount: 159000, status: 'success', date: '2024-11-19 21:30' },
    { id: 'TRX-20241119-002', orderId: 'ORD-8829081', game: 'Mobile Legends', item: '1159 Diamonds', amount: 199000, status: 'success', date: '2024-11-19 19:45' },
    { id: 'TRX-20241119-003', orderId: 'ORD-8829082', game: 'Free Fire', item: '1080 Diamonds', amount: 149000, status: 'processing', date: '2024-11-19 17:30' },
    { id: 'TRX-20241118-001', orderId: 'ORD-8829070', game: 'Genshin Impact', item: '6480 Genesis Crystals', amount: 1599000, status: 'success', date: '2024-11-18 15:20' },
    { id: 'TRX-20241118-002', orderId: 'ORD-8829071', game: 'PUBG Mobile', item: '1800 UC', amount: 399000, status: 'success', date: '2024-11-18 13:10' },
    { id: 'TRX-20241118-003', orderId: 'ORD-8829072', game: 'Steam Wallet', item: 'IDR 100.000', amount: 108000, status: 'pending', date: '2024-11-18 11:00' },
  ];

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
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
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
      </div>
    </div>
  );
}