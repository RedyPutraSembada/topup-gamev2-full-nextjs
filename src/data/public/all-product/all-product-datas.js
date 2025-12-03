import { getAllDataProduct } from "@/actions/public/all-product/all-product";
import { useQuery } from "@tanstack/react-query";

export function useGetDataAllProduct() {
  return useQuery({
    queryFn: async () => getAllDataProduct(),
    queryKey: ["get-all-data-product"],
  });
}