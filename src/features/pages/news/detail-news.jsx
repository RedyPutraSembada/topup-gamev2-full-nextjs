'use client'

import { Editor } from "@/components/editor/DynamicEditor";
import { EditorViewer } from "@/components/editor/DynamicEditorViewer";
import BlockNoteViewer from "@/components/editor/EditorBlockNoteViewer";
import { Bookmark, Calendar, Check, ChevronLeft, Clock, Facebook, Heart, Link2, MessageCircle, Twitter, User } from "lucide-react";
import { useMemo, useState } from "react";

export function DetailNews({ articleData }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(248);
    const [copied, setCopied] = useState(false);
    console.log("articleData.content", articleData.content);
    const content =
        typeof articleData?.content === "string"
            ? JSON.parse(articleData?.content)
            : articleData?.content;
    

  // Parse content dari JSON string ke array


  // Parse tags dari JSON string ke array
  const parsedTags = useMemo(() => {
    try {
      return JSON.parse(articleData.tags);
    } catch (error) {
      console.error("Error parsing tags:", error);
      return [];
    }
  }, [articleData.tags]);

  // Konversi BlockNote content ke HTML
  const renderContent = (blocks) => {
    return blocks.map((block) => {
      const textContent = block.content?.map(item => {
        let text = item.text || '';
        if (item.styles?.bold) text = `<strong>${text}</strong>`;
        if (item.styles?.italic) text = `<em>${text}</em>`;
        return text;
      }).join('') || '';

      const style = `
        ${block.props?.backgroundColor && block.props.backgroundColor !== 'default' ? `background-color: ${block.props.backgroundColor};` : ''}
        ${block.props?.textColor && block.props.textColor !== 'default' ? `color: ${block.props.textColor};` : ''}
        ${block.props?.textAlignment ? `text-align: ${block.props.textAlignment};` : ''}
      `.trim();

      switch (block.type) {
        case 'heading':
          const level = block.props?.level || 1;
          return `<h${level} style="${style}">${textContent}</h${level}>`;
        case 'paragraph':
          return `<p style="${style}">${textContent}</p>`;
        default:
          return `<p style="${style}">${textContent}</p>`;
      }
    }).join('');
  };

  const htmlContent = useMemo(() => renderContent(content), [content]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const calculateReadTime = (content) => {
    const blocks = Array.isArray(content) ? content : [];
    const wordCount = blocks.reduce((total, block) => {
      const text = block.content?.map(item => item.text || '').join(' ') || '';
      return total + text.split(/\s+/).length;
    }, 0);
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min`;
  };

  const readTime = useMemo(() => calculateReadTime(content), [content]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedArticles = [
    { id: 2, title: 'Panduan Lengkap Build Hero Ling Season 32', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop', category: 'Panduan', date: '2024-11-21' },
    { id: 3, title: 'Promo Top Up Double Diamond Spesial 11.11', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop', category: 'Promo', date: '2024-11-20' },
    { id: 4, title: 'Tips Pro Player: Cara Rotasi yang Benar', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop', category: 'Panduan', date: '2024-11-18' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Artikel
        </button>

        {/* Article Header */}
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            {parsedTags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            {articleData.title}
          </h1>
          
          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            {/* <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
              <span>Admin TopUp</span>
            </div> */}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(articleData.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime} baca
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden mb-6">
          <img 
            src={articleData.image_hero} 
            alt={articleData.title} 
            className="w-full h-48 sm:h-64 lg:h-80 object-cover" 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between py-4 border-y border-gray-800 mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* <button 
              onClick={handleLike} 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isLiked ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{likeCount}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">32</span>
            </button>
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)} 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isBookmarked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Simpan</span>
            </button> */}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
              <Facebook className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
              <Twitter className="w-4 h-4" />
            </button>
            <button 
              onClick={handleCopyLink} 
              className={`p-2 rounded-lg transition-colors ${
                copied ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Article Content */}
        <div className='prose prose-sm md:prose-base max-w-none'>
			<EditorViewer
                content={content}
            />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {parsedTags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1.5 rounded-full text-xs bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer transition-colors"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        {/* Author Box */}
        {/* <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Ditulis oleh</p>
              <h4 className="font-bold text-base sm:text-lg mb-1">Admin TopUp</h4>
              <p className="text-sm text-gray-400">Tim redaksi yang selalu menghadirkan informasi terbaru seputar dunia gaming dan promo menarik untuk para gamers.</p>
            </div>
          </div>
        </div> */}

        {/* Related Articles */}
        {/* <section>
          <h3 className="text-lg sm:text-xl font-bold mb-4">Artikel Terkait</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map(item => (
              <article 
                key={item.id} 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer group"
              >
                <div className="h-32 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-3">
                  <span className="text-xs text-indigo-400 mb-1 block">{item.category}</span>
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(item.date)}</p>
                </div>
              </article>
            ))}
          </div>
        </section> */}
      </div>
    </div>
  );
}