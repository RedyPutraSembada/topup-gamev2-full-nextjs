import { getProductInProvider } from "@/actions/admin/product-in-provider/product-in-provider";
import { useQuery } from "@tanstack/react-query";

export function useGetProductInProvider(filter, page, pageSize) {
  return useQuery({
    queryFn: async () => getProductInProvider(filter, page, pageSize),
    queryKey: ["product-in-provider", filter, page, pageSize],
  });
}
