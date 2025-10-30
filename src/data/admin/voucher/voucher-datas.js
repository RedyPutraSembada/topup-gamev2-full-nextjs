import { getVoucher } from "@/actions/admin/voucher/voucher";
import { useQuery } from "@tanstack/react-query";

export function useGetVoucher(filter, page, pageSize) {
  return useQuery({
    queryFn: async () => getVoucher(filter, page, pageSize),
    queryKey: ["voucher", filter, page, pageSize],
  });
}
