import {
	createSelectSchema,
	createInsertSchema,
	createUpdateSchema,
} from "drizzle-zod";
import { pgTable } from "drizzle-orm/pg-core";
import z from "zod";

export const todos = pgTable("todos", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	title: t.varchar({ length: 30 }),
	description: t.text(),
	completed: t.boolean().default(false),
	createdAt: t.timestamp().defaultNow(),
	updatedAt: t.timestamp(),
}));

export const selectTodoSchema = createSelectSchema(todos);
export const insertTodoSchema = createInsertSchema(todos).omit({ id: true });
export const updateTodoSchema = createUpdateSchema(todos).omit({ id: true });

export type Todo = z.infer<typeof selectTodoSchema>;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;
