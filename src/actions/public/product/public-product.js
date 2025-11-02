"use server";

import { db } from "@/lib/db/knex";

export async function getProductPublic(filter = {}, page = 1, perPage = 10) {
  try {
    // Function to build the query
    const getModel = () =>
      db("products")
        .select("id", "title", "slug", "image_thumbnail")
        .modify((builder) => {
          // Apply filters based on the filter parameter
          Object.entries(filter).forEach(([column, value]) => {
            if (value) {
              // Filter by title
              if (column === "id_type_product") {
                builder.where("type_product_id", value);
              }
            }
          });
        })
        .orderBy("created_at", "desc");

    // Variables to hold data and pagination
    let data, total, offset;

    // If perPage is set to -1, fetch all data without pagination
    if (perPage === -1) {
      data = await getModel();
      total = data.length;
    } else {
      // Apply pagination
      offset = (page - 1) * perPage;
      const totalCount = await getModel();
      data = await getModel().offset(offset).limit(perPage);
      total = totalCount.length;
    }

    // Calculate the next page (if any)
    const nextPage = offset + perPage < total ? page + 1 : null;

    // Return the data, total count, current page, perPage, and next page
    return { data, total, page, perPage, nextPage };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch public ");
  }
}

export async function getProductBySlug(slug) {
  try {
    const data = await db("products").whereILike("slug", slug).first();

    return data;
  } catch (error) {
    throw new Error("Failed to get Product");
  }
}

export async function getProductBySlugAndProductInProvider(slug) {
  try {
    const product = await db("products").whereILike("slug", slug).first();

    const providers = await db("product_in_providers").where(
      "product_id",
      product.id
    );

    const data = {
      ...product,
      providers, // array relasi
    };

    return data;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to get Product");
  }
}

export async function getProductInProvider(id) {
  try {
    const data = await db("products.*", "").whereILike("slug", slug).first();

    return data;
  } catch (error) {
    throw new Error("Failed to get Product");
  }
}
