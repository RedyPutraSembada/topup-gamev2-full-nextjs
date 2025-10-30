"use server";

import { db } from "@/lib/db/knex";

export async function getVoucher(filter = {}, page = 1, perPage = 10) {
  try {
    let data, total;

    const getModel = () =>
      db("vouchers")
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
    throw new Error("Failed to fetch Voucher");
  }
}

export async function createVoucher(data) {
  try {
    const [id] = await db("vouchers").insert({
      name: data.name,
      type: data.type,
      total: data.total,
      kuota: data.kuota,
      is_active: data.is_active,
    });
    return { success: true, id };
  } catch (error) {
    throw new Error("Failed to create Voucher");
  }
}

export async function updateVoucher(data) {
  try {
    await db("vouchers").where("id", data.id).update({
      name: data.name,
      type: data.type,
      total: data.total,
      kuota: data.kuota,
      is_active: data.is_active,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update Voucher");
  }
}

export async function deleteVoucher(id) {
  try {
    await db("vouchers").where({ id }).delete();
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete Voucher");
  }
}

export async function checkExistVoucher(id) {
  try {
    const data = await db("vouchers").where("id", id).first();

    return data;
  } catch (error) {
    throw new Error("Failed to get Voucher");
  }
}
