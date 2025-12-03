"use server";

import { db } from "@/lib/db/knex";

export async function getAllDataProduct() {
    try {
        const data = await db.raw(`
            SELECT
            p.*,
            pip.name AS name_product_in_provider,
            tp.name AS category_name
            FROM products p
            LEFT JOIN (
                SELECT pip1.*
                FROM product_in_providers pip1
                INNER JOIN (
                    SELECT product_id, MIN(id) AS min_id
                    FROM product_in_providers
                    GROUP BY product_id
                ) x ON pip1.product_id = x.product_id AND pip1.id = x.min_id
            ) pip ON pip.product_id = p.id
            LEFT JOIN type_products tp ON tp.id = p.type_product_id;
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