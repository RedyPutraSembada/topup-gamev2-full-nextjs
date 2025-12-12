'use server';

import { db } from "@/lib/db/knex";

export async function getSliderHome() {
    
    try {
        const [data] = await db.raw(`SELECT * FROM images_slideshow`);

        return { data, success: true }        
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch Slider");        
    }
    
}