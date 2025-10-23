import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
import { Resend } from 'resend';
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, myCustomRole, user, member } from "./permissions";
import ForgotPasswordEmail from "../components/email/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  


  export const auth = betterAuth({
    database: {
        type: "mysql", // <--- tambahkan ini
        client: pool,  // <--- ubah dari "database: pool"
      },
    trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL],
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
      sendResetPassword: async ({ user, url }) => {
        // Send reset password email
        resend.emails.send({
          from: "support@goxpay.id",
          to: user.email,
          subject: "Reset Password",
          react: ForgotPasswordEmail({
            userEmail: user.email,
            resetLink: url,
          }),
        });
      },
    },
    user: {
      deleteUser: {
        enabled: true,
      },
      fields: {
        name: "nama_full",
      },
      additionalFields: {
        role: {
          type: "string",
          required: true,
          default: "admin",
          enum: ["user", "admin", "member"],
          editable: true,
        },
        tempat_lahir: {
          type: "string",
          required: false,
        },
        tanggal_lahir: {
          type: "date",
          required: false,
        },
        tanggal_bergabung: {
          type: "date",
          required: false,
        },
        profil: {
            type: "string",
            required: false,
        },
        alamat: {
            type: "text",
            required: false,
        },
        whatsapp: {
            type: "string",
            required: false,
        },
        saldo: {
            type: "string",
            required: false,
        },
        gender: {
            type: "string",
            required: false,
        },
      },
    },
    plugins: [
      adminPlugin({
        adminRoles: ["admin"],
        ac,
        roles: {
          admin,
          user,
          member,
          myCustomRole,
        },
      }),
      nextCookies(),
    ],
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60,
      },
    },
  });
  