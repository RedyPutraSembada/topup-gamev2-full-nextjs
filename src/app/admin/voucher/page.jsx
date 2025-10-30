import { DataVoucherList } from "@/features/admin/voucher/data-voucher-list";

export default async function page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DataVoucherList />
    </div>
  );
}
