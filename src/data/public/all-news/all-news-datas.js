import { getAllDataNews } from "@/actions/public/all-news/all-news";
import { useQuery } from "@tanstack/react-query";

export function useGetDataAllNews() {
  return useQuery({
    queryFn: async () => getAllDataNews(),
    queryKey: ["get-all-data-news"],
  });
}