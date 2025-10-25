"use-client"

import HeroSlider from "@/features/pages/home/hero";
import News from "@/features/pages/home/news";
import Image from "next/image";
import Product from "@/features/pages/home/product";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session.user) {
        if (session.user.role === "admin") {
            redirect("/admin")
        }
    }
    return (
        <>
            <HeroSlider />
            <Product />
            <News />
        </>
    )
}