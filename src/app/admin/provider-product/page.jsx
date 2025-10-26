import { ProviderProductList } from "@/features/admin/provider-products/provider-product-list";

export default async function page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <ProviderProductList />
    </div>
  );
}
