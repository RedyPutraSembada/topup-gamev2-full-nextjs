"use client"
import { useState } from 'react';
import { Calendar, Clock, ChevronLeft, Share2, Bookmark, Heart, MessageCircle, Facebook, Twitter, Link2, Check, User } from 'lucide-react';

export default function ArticleDetailPage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(248);
  const [copied, setCopied] = useState(false);

  const article = {
    id: 1,
    title: 'Update Terbaru Mobile Legends: Hero Baru dan Revamp yang Wajib Kamu Ketahui',
    excerpt: 'Moonton resmi mengumumkan hero baru yang akan hadir di update patch mendatang beserta beberapa revamp hero lama.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
    category: 'news',
    categoryName: 'Berita Game',
    date: '2024-11-22',
    readTime: '5 min',
    author: { name: 'Admin TopUp', avatar: 'A' },
    comments: 32,
    content: `
      <p>Mobile Legends: Bang Bang terus menghadirkan konten-konten menarik untuk para pemainnya. Dalam update patch terbaru yang akan dirilis minggu depan, Moonton mengumumkan beberapa perubahan besar yang patut dinantikan.</p>

      <h2>Hero Baru: Sephira</h2>
      <p>Hero baru bernama Sephira akan hadir sebagai Mage dengan kemampuan unik yang belum pernah ada sebelumnya. Sephira memiliki skill yang dapat memanipulasi waktu, membuatnya menjadi hero yang sangat menarik untuk dimainkan.</p>
      <p>Beberapa kemampuan utama Sephira meliputi:</p>
      <ul>
        <li><strong>Passive - Time Warp:</strong> Setiap 10 detik, Sephira dapat menghindari satu serangan musuh secara otomatis.</li>
        <li><strong>Skill 1 - Temporal Strike:</strong> Melemparkan bola energi waktu yang memberikan damage dan slow kepada musuh.</li>
        <li><strong>Skill 2 - Rewind:</strong> Kembali ke posisi 3 detik sebelumnya dan memulihkan sebagian HP.</li>
        <li><strong>Ultimate - Time Stop:</strong> Menghentikan waktu di area tertentu, membuat semua musuh di dalamnya tidak bisa bergerak selama 2 detik.</li>
      </ul>

      <h2>Revamp Hero Lama</h2>
      <p>Selain hero baru, Moonton juga akan melakukan revamp pada beberapa hero yang sudah lama tidak mendapat perhatian. Hero-hero yang akan di-revamp antara lain:</p>
      
      <h3>1. Miya</h3>
      <p>Miya akan mendapatkan visual baru yang lebih modern serta penyesuaian pada skill set-nya. Ultimate Miya kini akan memberikan efek invisibility yang lebih lama dan bonus attack speed yang lebih besar.</p>

      <h3>2. Balmond</h3>
      <p>Balmond akan mendapatkan peningkatan pada durability dan damage output. Skill 2 Balmond kini memiliki range yang lebih luas dan dapat mengenai lebih banyak target.</p>

      <h2>Perubahan Item dan Meta</h2>
      <p>Update ini juga membawa perubahan pada beberapa item populer. Blade of Despair akan mendapatkan nerf pada bonus damage-nya, sementara item defense seperti Antique Cuirass akan mendapat buff untuk menyeimbangkan meta saat ini.</p>

      <h2>Event Spesial</h2>
      <p>Bertepatan dengan update ini, Moonton juga mengadakan event spesial di mana pemain bisa mendapatkan skin gratis dan berbagai hadiah menarik lainnya. Event ini akan berlangsung selama 2 minggu penuh.</p>

      <p>Jangan lupa untuk terus pantau update terbaru dari Mobile Legends dan top up diamond kamu di platform kami untuk mendapatkan harga terbaik!</p>
    `
  };

  const relatedArticles = [
    { id: 2, title: 'Panduan Lengkap Build Hero Ling Season 32', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop', category: 'Panduan', date: '2024-11-21' },
    { id: 3, title: 'Promo Top Up Double Diamond Spesial 11.11', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop', category: 'Promo', date: '2024-11-20' },
    { id: 4, title: 'Tips Pro Player: Cara Rotasi yang Benar', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop', category: 'Panduan', date: '2024-11-18' },
  ];

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Artikel
        </button>

        {/* Article Header */}
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
              {article.categoryName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-4">{article.excerpt}</p>
          
          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                {article.author.avatar}
              </div>
              <span>{article.author.name}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />{formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />{article.readTime} baca
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden mb-6">
          <img src={article.image} alt={article.title} className="w-full h-48 sm:h-64 lg:h-80 object-cover" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between py-4 border-y border-gray-800 mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isLiked ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'}`}>
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{likeCount}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{article.comments}</span>
            </button>
            <button onClick={() => setIsBookmarked(!isBookmarked)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isBookmarked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'}`}>
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Simpan</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
              <Facebook className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
              <Twitter className="w-4 h-4" />
            </button>
            <button onClick={handleCopyLink} className={`p-2 rounded-lg transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'}`}>
              {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-invert prose-sm sm:prose-base max-w-none mb-8">
          <style>{`
            .prose h2 { font-size: 1.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: white; }
            .prose h3 { font-size: 1.1rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #e5e7eb; }
            .prose p { color: #9ca3af; line-height: 1.75; margin-bottom: 1rem; }
            .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
            .prose li { color: #9ca3af; margin-bottom: 0.5rem; }
            .prose strong { color: #e5e7eb; }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Mobile Legends', 'Update', 'Hero Baru', 'Patch Notes', 'MOBA'].map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full text-xs bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer transition-colors">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Box */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold shrink-0">
              {article.author.avatar}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Ditulis oleh</p>
              <h4 className="font-bold text-base sm:text-lg mb-1">{article.author.name}</h4>
              <p className="text-sm text-gray-400">Tim redaksi yang selalu menghadirkan informasi terbaru seputar dunia gaming dan promo menarik untuk para gamers.</p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <section>
          <h3 className="text-lg sm:text-xl font-bold mb-4">Artikel Terkait</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map(item => (
              <article key={item.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer group">
                <div className="h-32 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <span className="text-xs text-indigo-400 mb-1 block">{item.category}</span>
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(item.date)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}