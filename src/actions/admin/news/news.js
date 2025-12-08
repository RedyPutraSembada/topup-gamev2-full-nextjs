"use server";

import { db } from "@/lib/db/knex";

export async function getNews(filter = {}, page = 1, perPage = 10) {
  try {
    let data, total;

    const getModel = () =>
      db("news")
        .modify((builder) => {
          Object.entries(filter).forEach(([column, value]) => {
            if (value) {
              if (column === "title") {
                builder.whereILike("title", `%${value}%`);
              }
            }
          });
        })
        .select(
          "*",
        )
        .orderBy("id", "desc");

    let offset;
    if (perPage === -1) {
      data = await getModel();
      total = data.length;
    } else {
      offset = (page - 1) * perPage;
      const totalCount = await getModel();
      data = await getModel().offset(offset).limit(perPage);
      total = totalCount.length;
    }
    const nextPage = offset + perPage < total ? page + 1 : null;

    return { data, total, page, perPage, nextPage };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch News");
  }
}

export async function createNews(data) {
  try {
    const [id] = await db("news").insert({
      title: data.title,
      slug: data.slug,
      image_hero: data.image_hero,
      date: data.date,
      content: data.content,
      tags: data.tags,
      is_active: data.is_active,
    });
    return { success: true, id };
  } catch (error) {
    throw new Error("Failed to create News");
  }
}

export async function updateNews(data) {
  try {
    await db("news").where("id", data.id).update({
      title: data.title,
      slug: data.slug,
      image_hero: data.image_hero,
      date: data.date,
      content: data.content,
      tags: data.tags,
      is_active: data.is_active,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update News");
  }
}

export async function deleteNews(id) {
  try {
    await db("news").where({ id }).delete();
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete News");
  }
}

export async function checkExistNews(id) {
  try {
    const data = await db("news").where("id", id).first();

    return data;
  } catch (error) {
    throw new Error("Failed to get News");
  }
}
