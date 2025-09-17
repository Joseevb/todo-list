import {
	TodoRepository,
	TodoRepositoryLive,
} from "@/db/repositories/todo-repository";
import { Effect } from "effect";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { insertTodoSchema } from "@/db/schemas/todo-schema";

export const getTodos = Effect.gen(function* () {
	const repo = yield* TodoRepository;
	return yield* repo.getTodos;
}).pipe(Effect.provide(TodoRepositoryLive));

export const createTodo = async (formData: FormData) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth");
	}

	const title = formData.get("title") as string;
	const description = formData.get("description") as string;

	const validatedData = insertTodoSchema.parse({
		title,
		description,
		userId: session.user.id,
	});

	await Effect.runPromise(
		Effect.gen(function* () {
			const repo = yield* TodoRepository;
			return yield* repo.insertTodo(validatedData);
		}).pipe(Effect.provide(TodoRepositoryLive))
	);

	redirect("/");
};
