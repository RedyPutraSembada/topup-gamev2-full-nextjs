import {
  checkExistProductInProvider,
  getAllProduct,
} from "@/actions/admin/product-in-provider/product-in-provider";
import { getAllProviderProduct } from "@/actions/admin/provider-product/data-provider-product";
import BackMenu from "@/components/global/back-menu";
import { NotFound } from "@/components/global/error/not-found";
import { FormEditProductInProvider } from "@/features/admin/product-in-provider/edit/form-edit-product-in-provider";

export default async function page({ params }) {
  const id = (await params).id;
  const products = await getAllProduct();
  const providerProducts = await getAllProviderProduct();
  const productInProvider = await checkExistProductInProvider(id);

  if (!productInProvider) {
    return <NotFound href="/admin/product" />;
  }
  return (
    <div className="container mx-auto py-10 pt-0">
      <BackMenu href={"/admin/product"} />
      <FormEditProductInProvider
        products={products}
        providerProducts={providerProducts}
        productInProvider={productInProvider}
      />
    </div>
  );
}
