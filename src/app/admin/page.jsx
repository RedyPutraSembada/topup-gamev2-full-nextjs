"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/utils/auth-client"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()
  const {data: session, isPending: loading} = authClient.useSession()

  if (loading) {
    return <div>Loading....</div>
  }

  const setAdminBNutton = async () => {
    const { data, error } = await authClient.admin.setRole({
        userId: "9bTffMhCKBh6AzEy7X4GCXyKXv1PqLmG", // required
        role: "admin",
       });
}

  return (
    
        <div className="flex flex-1 flex-col gap-4 p-4">
          {session == null ? 
            Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="bg-muted/50 aspect-video h-12 w-full rounded-lg" />
            ))
           : (
            <>
              <h1>Welcome : {session.user.name}</h1>
              <Button
                size="lg"
                variant="destructive"
                onClick={() => {
                  authClient.signOut()
                  router.push("/sign-in")
                }}
              >
                Sign Out
              </Button>
              <Button
                onClick={setAdminBNutton}
                className="bg-red-600 text-white px-4 py-2 rounded"
                >
                Set Admin
              </Button>
            </>
          )}
        </div>
  );
}
