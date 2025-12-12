"use client";

import { getProductPublic } from "@/actions/public/product/public-product";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState, useRef } from "react";
import { useDebounce } from "use-debounce";

export default function Product({ type_product }) {
  const initialFilterState = {
    id_type_product: type_product?.[0]?.value || 0,
  };

  const [filter, setFilter] = useState(initialFilterState);
  const [debouncedTypeProduct] = useDebounce(filter.id_type_product, 500);
  const [pageSize] = useState(6);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef(null);

  // Auto set pertama kalau type_product berubah
  useEffect(() => {
    if (type_product?.length > 0) {
      setFilter({ id_type_product: type_product[0].value });
    }
  }, [type_product]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "infinite-products",
      {
        pageSize,
        filter: {
          id_type_product: debouncedTypeProduct,
        },
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getProductPublic(
        {
          id_type_product: debouncedTypeProduct,
        },
        pageParam,
        pageSize
      );
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
  });

  // Get active label
  const activeItem = type_product?.find(
    (item) => item.value === filter.id_type_product
  );
  const activeLabel = activeItem?.label || "Semua Product";

  // Check scroll position
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [type_product]);

  // Scroll functions
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleReset = () => {
    setFilter({ id_type_product: type_product?.[0]?.value || 0 });
    setShowDropdown(false);
  };

  // Count total products
  const totalProducts = data?.pages?.reduce(
    (total, page) => total + (page.data?.length || 0),
    0
  ) || 0;

  return (
    <div className="px-4 lg:px-8 pb-8 text-white">
      {/* Header with Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Product</h2>

            {/* Active Filter Badge - Mobile */}
            {filter.id_type_product !== type_product?.[0]?.value && (
              <button
                onClick={handleReset}
                className="md:hidden flex items-center gap-1 px-2 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-xs font-medium text-indigo-400 hover:bg-indigo-600/30 transition-colors"
              >
                <span className="truncate max-w-[80px]">{activeLabel}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Product Count */}
            {!isLoading && totalProducts > 0 && (
              <span className="hidden sm:inline-block text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {totalProducts} produk
              </span>
            )}
          </div>

          {/* Desktop: Dropdown Filter */}
          <div className="hidden md:flex items-center gap-2">
            {filter.id_type_product !== type_product?.[0]?.value && (
              <button
                onClick={handleReset}
                className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Reset
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-all duration-200 min-w-[180px] justify-between border border-gray-700 hover:border-gray-600"
              >
                <span className="truncate">{activeLabel}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />

                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 z-50 max-h-96 overflow-y-auto">
                    {type_product?.map((item) => {
                      const isActive = filter.id_type_product === item.value;

                      return (
                        <button
                          key={item.value}
                          onClick={() => {
                            setFilter({ id_type_product: item.value });
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            isActive
                              ? "bg-indigo-600 text-white font-medium"
                              : "text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden relative">
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-2 z-10 flex items-center bg-linear-to-r from-gray-900 via-gray-900/80 to-transparent pointer-events-none">
              <button
                onClick={() => scroll("left")}
                className="pointer-events-auto w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 ml-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide -mx-4 px-4"
          >
            <div className="flex gap-2 pb-2">
              {type_product?.map((item) => {
                const isActive = filter.id_type_product === item.value;

                return (
                  <button
                    key={item.value}
                    onClick={() => setFilter({ id_type_product: item.value })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 border ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-2 z-10 flex items-center bg-linear-to-l from-gray-900 via-gray-900/80 to-transparent pointer-events-none">
              <button
                onClick={() => scroll("right")}
                className="pointer-events-auto w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 mr-2 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading ? (
          // LOADING STATE
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-3/4 bg-gray-800 rounded-xl mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))
        ) : isError ? (
          // ERROR STATE
          <div className="col-span-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 font-medium mb-2">Gagal memuat produk</p>
            <p className="text-gray-500 text-sm mb-4">
              Terjadi kesalahan saat mengambil data
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : data?.pages?.length > 0 && data.pages[0]?.data?.length > 0 ? (
          // DATA STATE
          <>
            {data.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.data.map((item, itemIndex) => (
                  <Link
                    key={`${item.id || itemIndex}`}
                    href={`/product/${item.slug}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-2 bg-gray-800">
                      <img
                        src={item.image_thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </Fragment>
            ))}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="col-span-full flex justify-center mt-6">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isFetchingNextPage ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memuat...
                    </span>
                  ) : (
                    "Muat Lebih Banyak"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          // EMPTY STATE
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-gray-400 font-medium mb-2">
              Belum ada produk
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Produk untuk kategori ini belum tersedia
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}