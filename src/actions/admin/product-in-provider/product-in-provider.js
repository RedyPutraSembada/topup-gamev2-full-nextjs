"use server";

import { db } from "@/lib/db/knex";

export async function getProductInProvider(
  filter = {},
  page = 1,
  perPage = 10
) {
  try {
    let data, total;

    const getModel = () =>
      db("product_in_providers as pip")
        .leftJoin("products as p", "pip.product_id", "p.id")
        .leftJoin("provider_products as pp", "pip.product_provider_id", "pp.id")
        .modify((builder) => {
          Object.entries(filter).forEach(([column, value]) => {
            if (value) {
              if (column === "name") {
                builder.whereILike("pip.name", `%${value}%`);
              } else if (column === "product" && value.length > 0) {
                builder.whereIn("pip.product_id", value);
              } else if (column === "providerproduct" && value.length > 0) {
                builder.whereIn("pip.product_provider_id", value);
              }
            }
          });
        })
        .select(
          "pip.*",
          "p.title as product_title", // ambil nama tipe produk
          "pp.name as provider_product_name" // ambil nama tipe produk
        )
        .orderBy("pip.created_at", "desc");

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
    throw new Error("Failed to fetch Product In Provider");
  }
}

export async function createProductInProvider(data) {
  try {
    const [id] = await db("product_in_providers").insert({
      product_provider_id: data.product_provider_id,
      product_id: data.product_id,
      type: data.type,
      product_id_from_provider: data.product_id_from_provider,
      code: data.code,
      modal: data.modal,
      name: data.name,
      amount_member: data.amount_member,
      amount_seller: data.amount_seller,
      flash_sale: data.flash_sale,
      title_flash_sale: data.title_flash_sale,
      amount_flash_sale: data.amount_flash_sale,
      expired_flash_sale: data.expired_flash_sale,
      is_active: data.is_active,
      product_icon: data.product_icon,
      banner_flash_sale: data.banner_flash_sale,
    });
    return { success: true, id };
  } catch (error) {
    console.log(error);
    
    throw new Error("Failed to create Product In Provider");
  }
}

export async function updateProductInProvider(data) {
  try {
    console.log(data);

    await db("product_in_providers").where("id", data.id).update({
      product_provider_id: data.product_provider_id,
      product_id: data.product_id,
      type: data.type,
      product_id_from_provider: data.product_id_from_provider,
      code: data.code,
      modal: data.modal,
      name: data.name,
      amount_member: data.amount_member,
      amount_seller: data.amount_seller,
      flash_sale: data.flash_sale,
      title_flash_sale: data.title_flash_sale,
      amount_flash_sale: data.amount_flash_sale,
      expired_flash_sale: data.expired_flash_sale,
      is_active: data.is_active,
      product_icon: data.product_icon,
      banner_flash_sale: data.banner_flash_sale,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update Product In Provider");
  }
}

export async function deleteProductInProvider(id) {
  try {
    await db("product_in_providers").where({ id }).delete();
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete Product In Provider");
  }
}

export async function checkExistProductInProvider(id) {
  try {
    const data = await db("product_in_providers").where("id", id).first();

    return data;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to get Product In Provider");
  }
}

export async function getAllProduct() {
  try {
    const data = await db("products").select(
      "title as label",
      "id as value",
      "type_data_product"
    );
    return data;
  } catch (error) {
    throw new Error("Failed to get Product In Provider");
  }
}
