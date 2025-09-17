import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as todoSchema from "./schemas/todo-schema";
import * as authSchema from "./schemas/auth-schema";

export const db = drizzle(process.env.DATABASE_URL!, {
	schema: { ...todoSchema, ...authSchema },
});
