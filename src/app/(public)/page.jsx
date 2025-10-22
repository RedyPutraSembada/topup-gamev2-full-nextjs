import AllProduct from "@/features/pages/home/all-product";
import HeroSlider from "@/features/pages/home/hero";
import News from "@/features/pages/home/news";
import Image from "next/image";

export default async function HomePage() {
    return (
        <>
            <HeroSlider />
            <AllProduct />
            <News />
        </>
    )
}