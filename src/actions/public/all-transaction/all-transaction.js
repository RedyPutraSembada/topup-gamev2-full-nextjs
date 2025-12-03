'use server'

import { db } from "@/lib/db/knex";

export async function getAllDataTransaction() {
    try {
        const data = await db.raw(`
            select 
                t.*,
                pip.name as name_product_provider,
                p.image_thumbnail,
                p.title as product_name
            from transactions t 
            left join product_in_providers pip on pip.id = t.product_in_provider_id
            left join products p on p.id = pip.product_id;
        `);
        
        return {
            data: data[0],
            success: true
        }
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch product all data ");
    }
}