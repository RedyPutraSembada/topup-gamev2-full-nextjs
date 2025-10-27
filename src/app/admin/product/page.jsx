import { getAllTypeProduct } from "@/actions/admin/type-product/data-type-product";
import { DataProductList } from "@/features/admin/product/data-product-list";

export default async function page() {
  const categories = await getAllTypeProduct();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DataProductList categories={categories} />
    </div>
  );
}
