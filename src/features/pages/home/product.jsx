"use client";

import { getProductPublic } from "@/actions/public/product/public-product";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function Product({ type_product }) {
  const initialFilterState = {
    id_type_product: type_product?.[0]?.value || 0,
  };

  const [filter, setFilter] = useState(initialFilterState);
  const [debouncedTypeProduct] = useDebounce(filter.id_type_product, 500);
  const [pageSize] = useState(6);

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

  return (
    <div className="px-4 lg:px-8 pb-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Product</h2>

        <div className="flex gap-2">
          {type_product?.map((item) => {
            const isActive = filter.id_type_product === item.value;

            return (
              <button
                key={item.value}
                onClick={() => setFilter({ id_type_product: item.value })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-indigo-600" : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading ? (
          // LOADING STATE
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-3/4 bg-gray-800 rounded-xl mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))
        ) : isError ? (
          // ERROR STATE
          <div className="col-span-full flex flex-col items-center justify-center text-center py-8">
            <p className="text-red-400 font-medium mb-2">Gagal memuat produk</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition"
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
                  <div
                    key={`${item.id || itemIndex}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-2">
                      <img
                        src={item.image_thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-sm font-medium">{item.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="col-span-full flex justify-center mt-4">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 rounded-lg text-sm font-medium transition"
                >
                  {isFetchingNextPage ? "Memuat..." : "Muat Lebih Banyak"}
                </button>
              </div>
            )}
          </>
        ) : (
          // EMPTY STATE
          <div className="col-span-full flex flex-col items-center justify-center py-8">
            <p className="text-gray-400 mb-2">
              Belum ada produk untuk kategori ini
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition"
            >
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
