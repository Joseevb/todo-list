import { z } from "zod";

export const createTodoSchema = z.object({
	title: z
		.string()
		.nonempty("Title is required")
		.nonoptional("Title is required"),
	description: z
		.string()
		.nonempty("Description is required")
		.nonoptional("Description is required"),
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
