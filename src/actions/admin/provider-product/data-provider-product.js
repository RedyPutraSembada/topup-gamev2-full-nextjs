"use server";

import { db } from "@/lib/db/knex";

export async function getProviderProduct(filter = {}, page = 1, perPage = 10) {
  try {
    let data, total;

    const getModel = () =>
      db("provider_products")
        .modify((builder) => {
          Object.entries(filter).forEach(([column, value]) => {
            if (value) {
              if (column === "name") {
                builder.whereILike("name", `%${value}%`);
              }
            }
          });
        })
        .orderBy("created_at", "desc");

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
    throw new Error("Failed to fetch Website");
  }
}

export async function createProviderProduct(data) {
  try {
    const [id] = await db("provider_products").insert({
      name: data.name,
      is_active: data.is_active,
    });
    return { success: true, id };
  } catch (error) {
    throw new Error("Failed to create Provider Product");
  }
}

export async function updateProviderProduct(data) {
  try {
    await db("provider_products").where("id", data.id).update({
      name: data.name,
      is_active: data.is_active,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update Event");
  }
}

export async function deleteProviderProduct(id) {
  try {
    await db("provider_products").where({ id }).delete();
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete Data Website");
  }
}

export async function checkExistdataWebsite(id) {
  try {
    const data = await db("provider_products").where("id", id).first();

    return data;
  } catch (error) {
    throw new Error("Failed to get Data website");
  }
}
