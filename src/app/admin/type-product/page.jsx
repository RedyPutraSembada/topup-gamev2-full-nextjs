import { TypeProductList } from "@/features/admin/type-product/type-product-list";

export default async function page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <TypeProductList />
    </div>
  );
}
