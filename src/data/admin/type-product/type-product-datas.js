import { getTypeProduct } from "@/actions/admin/type-product/data-type-product";
import { useQuery } from "@tanstack/react-query";

export function useGetTypeProduct(filter, page, pageSize) {
  return useQuery({
    queryFn: async () => getTypeProduct(filter, page, pageSize),
    queryKey: ["type-product", filter, page, pageSize],
  });
}
