import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { Resend } from "resend";
import { jwt } from "better-auth/plugins";




const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("booknook");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset your password",
          text: `<p>Click the link below to reset your password:</p><a href="${url}">Reset Password</a>`,
        });
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Could not send reset email");
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 6 * 6,
    }

  },
});
