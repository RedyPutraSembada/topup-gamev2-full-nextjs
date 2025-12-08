"use server"

import { db } from "@/lib/db/knex";

export async function getLogoWebsite() {
    try {
        const logo = await db.raw(`
                select logo
                from data_websites
                limit 1
            `)
        console.log("logo", logo[0][0]);
        
        return {
            data: logo[0][0],
            success: true
        }
        
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch logo ");
    }
}