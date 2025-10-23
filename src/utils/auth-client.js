import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, member, myCustomRole, user } from "./permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        user,
        member,
        myCustomRole,
      },
    }),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
