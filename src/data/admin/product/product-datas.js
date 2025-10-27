import { getProduct } from "@/actions/admin/product/product";
import { useQuery } from "@tanstack/react-query";

export function useGetProduct(filter, page, pageSize) {
  return useQuery({
    queryFn: async () => getProduct(filter, page, pageSize),
    queryKey: ["product", filter, page, pageSize],
  });
}
