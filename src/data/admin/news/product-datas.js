import { getNews } from "@/actions/admin/news/news";
import { useQuery } from "@tanstack/react-query";

export function useGetNews(filter, page, pageSize) {
  return useQuery({
    queryFn: async () => getNews(filter, page, pageSize),
    queryKey: ["news", filter, page, pageSize],
  });
}
