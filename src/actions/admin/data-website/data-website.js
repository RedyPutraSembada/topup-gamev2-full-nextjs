"use server";

import { db } from "@/lib/db/knex";

export async function getDataWebsite(filter = {}, page = 1, perPage = 10) {
  try {
    let data, total;

    const getModel = () =>
      db("data_websites")
        .modify((builder) => {
          Object.entries(filter).forEach(([column, value]) => {
            if (value) {
              if (column === "title") {
                builder.whereILike("title_web", `%${value}%`);
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

export async function createDataWebsite(data) {
  try {
    const [id] = await db("data_websites").insert({
      id: data.id,
      title_web: data.title_web,
      slogan_web: data.slogan_web,
      desc_web: data.desc_web,
      url_wa: data.url_wa,
      url_ig: data.url_ig,
      url_tt: data.url_tt,
      url_yt: data.url_yt,
      url_fb: data.url_fb,
      logo: data.logo,
      signin_image: data.signin_image,
      signup_image: data.signup_image,
    });
    return { success: true, id };
  } catch (error) {
    throw new Error("Failed to create Data Website");
  }
}

export async function updateDataWebsite(data) {
  try {
    await db("data_websites").where("id", data.id).update({
      title_web: data.title_web,
      slogan_web: data.slogan_web,
      desc_web: data.desc_web,
      url_wa: data.url_wa,
      url_ig: data.url_ig,
      url_tt: data.url_tt,
      url_yt: data.url_yt,
      url_fb: data.url_fb,
      logo: data.logo,
      signin_image: data.signin_image,
      signup_image: data.signup_image,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update Data Website");
  }
}

export async function deleteDataWebsite(id) {
  try {
    await db("data_websites").where({ id }).delete();
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete Data Website");
  }
}

export async function checkExistdataWebsite(id) {
  try {
    const data = await db("data_websites").where("id", id).first();

    return data;
  } catch (error) {
    throw new Error("Failed to get Data website");
  }
}
