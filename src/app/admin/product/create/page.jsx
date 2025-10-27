import { getAllTypeProduct } from "@/actions/admin/type-product/data-type-product";
import BackMenu from "@/components/global/back-menu";
import { FormCreateProduct } from "@/features/admin/product/create/form-create-product";

export default async function page() {
  const typeProducts = await getAllTypeProduct();
  return (
    <div className="container mx-auto p-10">
      <BackMenu href={"/admin/product"} />
      <FormCreateProduct typeProducts={typeProducts} />
    </div>
  );
}
