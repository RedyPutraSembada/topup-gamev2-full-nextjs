"use client";
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export function CardNews({ item }) {
  return (
    <Link href={`/news/${item.slug}`} className="block">
      <Card className="overflow-hidden bg-[#1a1f2c] border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-0 h-full">
        
        {/* IMAGE - No padding/margin, fills top perfectly */}
        <div className="relative w-full h-48 sm:h-56 md:h-52 overflow-hidden -m-px">
          <Image
            src={item.image_hero}
            alt={item.title}
            fill
            unoptimized
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* CONTENT */}
        <CardContent className="p-5 sm:p-6 pt-4">
          {/* Tags */}
          {item.tags && (
            <div className="flex flex-wrap gap-2 mb-3">
              {JSON.parse(item.tags).slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-white font-semibold text-lg sm:text-xl mb-2 leading-snug line-clamp-2">
            {item.title}
          </h3>

          {/* Date */}
          <p className="text-sm text-gray-400 mb-3">
            {new Date(item.date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>

          {/* Read More Button */}
          <button className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 text-sm sm:text-base font-medium inline-flex items-center group">
            Baca selengkapnya
            <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </button>
        </CardContent>
      </Card>
    </Link>
  );
}