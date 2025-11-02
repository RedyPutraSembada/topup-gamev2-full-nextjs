import { checkVoucher } from "@/actions/public/voucher/public-voucher";
import { useQuery } from "@tanstack/react-query";

export function useCheckVoucher(voucher) {
  return useQuery({
    queryFn: async () => checkVoucher(voucher),
    queryKey: ["check-voucher", voucher],
  });
}
