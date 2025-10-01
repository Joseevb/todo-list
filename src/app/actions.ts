import {
	TodoRepository,
	TodoRepositoryLive,
} from "@/db/repositories/todo-repository";
import { Effect } from "effect";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { insertTodoSchema } from "@/db/schemas/todo-schema";
import {
	createTodoSchema,
	CreateTodoSchema,
} from "./schemas/create-todo-schema";

export const getTodos = Effect.gen(function* () {
	const repo = yield* TodoRepository;
	return yield* repo.getTodos;
}).pipe(Effect.provide(TodoRepositoryLive));

export const createTodo = async (data: CreateTodoSchema) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Authentication required");
	}

	// Validate the input data
	const validatedInput = createTodoSchema.parse(data);

	// Prepare data for database insertion
	const validatedData = insertTodoSchema.parse({
		title: validatedInput.title,
		description: validatedInput.description,
		userId: session.user.id,
	});

	return await Effect.runPromise(
		Effect.gen(function* () {
			const repo = yield* TodoRepository;
			return yield* repo.insertTodo(validatedData);
		}).pipe(Effect.provide(TodoRepositoryLive)),
	);
};
