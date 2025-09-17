import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { insertTodoSchema } from "@/db/schemas/todo-schema";
import {
	TodoRepository,
	TodoRepositoryLive,
} from "@/db/repositories/todo-repository";

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await request.formData();
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

		return NextResponse.redirect(new URL("/", request.url));
	} catch (error) {
		console.error("Error creating todo:", error);
		return NextResponse.json(
			{ error: "Failed to create todo" },
			{ status: 500 }
		);
	}
}