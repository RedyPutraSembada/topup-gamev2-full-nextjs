import { getAllDataTransaction } from "@/actions/public/all-transaction/all-transaction";
import { useQuery } from "@tanstack/react-query";

export function useGetDataAllTransaction() {
  return useQuery({
    queryFn: async () => getAllDataTransaction(),
    queryKey: ["get-all-data-transaction"],
  });
}