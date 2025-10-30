"use server";

import { db } from "@/lib/db/knex";

export async function getProduct(filter = {}, page = 1, perPage = 10) {
  try {
    let data, total;

    const getModel = () =>
      db("products as p")
        .leftJoin("type_products as tp", "p.type_product_id", "tp.id")
        .modify((builder) => {
          Object.entries(filter).forEach(([column, value]) => {
            if (value) {
              if (column === "title") {
                builder.whereILike("p.title", `%${value}%`);
              } else if (column === "type_product" && value.length > 0) {
                builder.whereIn("p.type_product_id", value);
              }
            }
          });
        })
        .select(
          "p.*",
          "tp.name as type_product_name" // ambil nama tipe produk
        )
        .orderBy("p.created_at", "desc");

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
    throw new Error("Failed to fetch Product");
  }
}

export async function createProduct(data) {
  try {
    const [id] = await db("products").insert({
      type_product_id: data.type_product_id,
      kode: data.kode,
      title: data.title,
      slug: data.slug,
      description: data.description,
      best_seller: data.best_seller,
      is_active: data.is_active,
      is_check_username: data.is_check_username,
      image_thumbnail: data.image_thumbnail,
      image_cover: data.image_cover,
      data_input: data.data_input,
      type_data_product: data.type_data_product,
    });
    return { success: true, id };
  } catch (error) {
    throw new Error("Failed to create Product");
  }
}

export async function updateProduct(data) {
  try {
    await db("products").where("id", data.id).update({
      type_product_id: data.type_product_id,
      kode: data.kode,
      title: data.title,
      slug: data.slug,
      description: data.description,
      best_seller: data.best_seller,
      is_active: data.is_active,
      is_check_username: data.is_check_username,
      image_thumbnail: data.image_thumbnail,
      image_cover: data.image_cover,
      data_input: data.data_input,
      type_data_product: data.type_data_product,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update Product");
  }
}

export async function deleteProduct(id) {
  try {
    await db("products").where({ id }).delete();
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete Product");
  }
}

export async function checkExistProduct(id) {
  try {
    const data = await db("products").where("id", id).first();

    return data;
  } catch (error) {
    throw new Error("Failed to get Product");
  }
}
