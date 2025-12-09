"use server";

import { db } from "@/lib/db/knex";

export async function getAllDataNews() {
    try {
        const data = await db.raw(`
            SELECT
            *
            FROM news
            ORDER BY id DESC;
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


export async function getNewsBySlug(slug) {
  try {
    const data = await db("news").where("slug", slug).first();
    return data;
  } catch (error) {
    throw new Error("Failed to get News by slug");
  }
}
// export async function createNews(data) {
//   try {
//     const [id] = await db("news").insert({
//       title: data.title,
//       slug: data.slug,
//       image_hero: data.image_hero,
//       date: data.date,
//       content: data.content,
//       tags: data.tags,
//       is_active: data.is_active,
//     });
//     return { success: true, id };
//   } catch (error) {
//     throw new Error("Failed to create News");
//   }
// }

// export async function updateNews(data) {
//   try {
//     await db("news").where("id", data.id).update({
//       title: data.title,
//       slug: data.slug,
//       image_hero: data.image_hero,
//       date: data.date,
//       content: data.content,
//       tags: data.tags,
//       is_active: data.is_active,
//     });

//     return { success: true };
//   } catch (error) {
//     console.log(error);
//     throw new Error("Failed to update News");
//   }
// }

// export async function deleteNews(id) {
//   try {
//     await db("news").where({ id }).delete();
//     return { success: true };
//   } catch (error) {
//     throw new Error("Failed to delete News");
//   }
// }

// export async function checkExistNews(id) {
//   try {
//     const data = await db("news").where("id", id).first();

//     return data;
//   } catch (error) {
//     throw new Error("Failed to get News");
//   }
// }
