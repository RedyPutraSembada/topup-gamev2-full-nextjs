import { getAllProduct } from "@/actions/admin/product-in-provider/product-in-provider";
import { getAllProviderProduct } from "@/actions/admin/provider-product/data-provider-product";
import { DataProductInProviderList } from "@/features/admin/product-in-provider/data-product-in-provider-list";

export default async function page() {
  const products = await getAllProduct();
  const providerProducts = await getAllProviderProduct();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DataProductInProviderList
        products={products}
        providerProducts={providerProducts}
      />
    </div>
  );
}
