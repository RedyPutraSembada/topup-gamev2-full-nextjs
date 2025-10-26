import { getProviderProduct } from "@/actions/admin/provider-product/data-provider-product";
import { useQuery } from "@tanstack/react-query";

export function useGetProviderProduct(filter, page, pageSize) {
  return useQuery({
    queryFn: async () => getProviderProduct(filter, page, pageSize),
    queryKey: ["provider-product", filter, page, pageSize],
  });
}
