import { getPaymentMethod } from "@/actions/payment-getaway/duitku";
import {
  getProductBySlug,
  getProductBySlugAndProductInProvider,
} from "@/actions/public/product/public-product";
import { PublicFormProduct } from "@/features/pages/detail-product/public-form-product";

export default async function GameDetailPage({ params }) {
  const slug = (await params).slug;
  const product = await getProductBySlugAndProductInProvider(slug);
  const paymentMethod = await getPaymentMethod();
  console.log("paymentMethod", paymentMethod);
  return (
    <>
      <PublicFormProduct product={product} paymentMethod={paymentMethod} />
    </>
  );
}
