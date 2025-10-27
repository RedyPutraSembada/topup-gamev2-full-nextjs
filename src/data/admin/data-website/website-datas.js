import { getDataWebsite } from "@/actions/admin/data-website/data-website";
import { useQuery } from "@tanstack/react-query";

export function useGetDataWebsite(filter, page, pageSize) {
  return useQuery({
    queryFn: async () => getDataWebsite(filter, page, pageSize),
    queryKey: ["events", filter, page, pageSize],
  });
}
