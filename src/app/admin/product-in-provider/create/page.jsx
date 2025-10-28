import { getAllProduct } from "@/actions/admin/product-in-provider/product-in-provider";
import { getAllProviderProduct } from "@/actions/admin/provider-product/data-provider-product";
import BackMenu from "@/components/global/back-menu";
import { FormCreateProductInProvider } from "@/features/admin/product-in-provider/create/form-create-product-in-provider";

export default async function page() {
  const products = await getAllProduct();
  const providerProducts = await getAllProviderProduct();
  return (
    <div className="container mx-auto p-10">
      <BackMenu href={"/admin/product"} />
      <FormCreateProductInProvider
        products={products}
        providerProducts={providerProducts}
      />
    </div>
  );
}
