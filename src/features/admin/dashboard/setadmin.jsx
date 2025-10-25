"use client"

import { authClient } from "@/utils/auth-client";

export async function SetAdmin() {

    const setAdminBNutton = async () => {
        const { data, error } = await authClient.admin.setRole({
            userId: "user-id", // required
            role: "admin",
           });
    }

       return (
        <button 
            onClick={setAdminBNutton}
            className="bg-red-600 text-white px-4 py-2 rounded"
            >
            Set Admin
            </button>
       )
}