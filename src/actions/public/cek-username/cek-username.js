"use server";

export async function checkUsernameGame(values) {
  const type_name = values.typeName;
  const user_id = values.userId;
  const zone_id = values.zoneId || "";

  const url = `https://api-cek-id-game-ten.vercel.app/api/check-id-game?type_name=${type_name}&userId=${user_id}&zoneId=${zone_id}`;
  const response = await fetch(url);
  try {
    const data = await response.json();
    if (data.status === true) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to check Username Game");
  }
}
