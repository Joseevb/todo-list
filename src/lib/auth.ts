import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { openAPI } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import * as schema from "@/db/schemas/auth-schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),

	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},

	appName: "todo-list",
	plugins: [passkey(), openAPI(), nextCookies()],

	user: { modelName: "users" },
	session: { modelName: "sessions" },
	account: { modelName: "accounts" },
	verification: { modelName: "verifications" },
});
