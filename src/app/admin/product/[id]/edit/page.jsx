import { checkExistProduct } from "@/actions/admin/product/product";
import { getAllTypeProduct } from "@/actions/admin/type-product/data-type-product";
import BackMenu from "@/components/global/back-menu";
import { NotFound } from "@/components/global/error/not-found";
import { FormEditProduct } from "@/features/admin/product/edit/form-edit-product";

export default async function page({ params }) {
  const id = (await params).id;
  const data = await checkExistProduct(id);
  const typeProducts = await getAllTypeProduct();

  if (!data) {
    return <NotFound href="/admin/product" />;
  }
  return (
    <div className="container mx-auto py-10 pt-0">
      <BackMenu href={"/admin/product"} />
      <FormEditProduct data={data} typeProducts={typeProducts} />
    </div>
  );
}
