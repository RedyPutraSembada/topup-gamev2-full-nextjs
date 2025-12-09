"use server";

import { db } from "@/lib/db/knex";

export async function getImageSlideShow(page = 1, perPage = 10) {
  try {
    const baseQuery = db("images_slideshow")
      .orderBy("created_at", "desc");

    let data, total, nextPage;

    if (perPage === -1) {
      // Ambil semua data tanpa pagination
      data = await baseQuery;
      total = data.length;
      nextPage = null;
    } else {
      const offset = (page - 1) * perPage;

      // Hitung total data (lebih efisien dari fetch semua)
      const countResult = await db("images_slideshow")
        .count("id as total")
        .first();

      total = Number(countResult.total);

      // Ambil data sesuai page
      data = await baseQuery.offset(offset).limit(perPage);

      // Hitung nextPage
      nextPage = offset + perPage < total ? page + 1 : null;
    }

    console.log("data getImageSlideShow", data);
    

    return { data, total, page, perPage, nextPage };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch Images Slideshow");
  }
}

export async function createDataImageSlideShow(data) {
  try {
    const [id] = await db("images_slideshow").insert({
      data_slider: data.data_slider,
    });
    return { success: true, id };
  } catch (error) {
    throw new Error("Failed to create Images Slideshow");
  }
}

export async function updateDataImageSlideShow(data) {
  try {
    await db("images_slideshow").where("id", data.id).update({
      data_slider: data.data_slider,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update Images Slideshow");
  }
}

export async function deleteDataImageSlideShow(id) {
  try {
    await db("images_slideshow").where({ id }).delete();
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete Images Slideshow");
  }
}

export async function checkExistDataImageSlideShow(id) {
  try {
    const data = await db("images_slideshow").where("id", id).first();

    return data;
  } catch (error) {
    throw new Error("Failed to get Images Slideshow");
  }
}
