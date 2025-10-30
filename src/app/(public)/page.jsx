"use-client";

import { getAllPublicTypeProduct } from "@/actions/public/type-product/public-type-product";
import HeroSlider from "@/features/pages/home/hero";
import News from "@/features/pages/home/news";
import Product from "@/features/pages/home/product";

export default async function HomePage() {
  const typeProduct = await getAllPublicTypeProduct();
  console.log(typeProduct);

  return (
    <>
      <HeroSlider />
      <Product type_product={typeProduct} />
      <News />
    </>
  );
}
