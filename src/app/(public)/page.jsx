import HeroSlider from "@/features/pages/home/hero";
import News from "@/features/pages/home/news";
import Image from "next/image";
import Product from "@/features/pages/home/product";

export default async function HomePage() {
    return (
        <>
            <HeroSlider />
            <Product />
            <News />
        </>
    )
}