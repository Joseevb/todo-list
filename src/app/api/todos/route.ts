import {
	TodoRepository,
	TodoRepositoryLive,
} from "@/db/repositories/todo-repository";
import { Schema, Effect, Data } from "effect";
import { NextRequest, NextResponse } from "next/server";

class ValidationError extends Data.TaggedError("ValidationError")<{
	errors: Record<string, string>;
}> {}

class PostTodo extends Schema.Class<PostTodo>("PostTodo")({
	title: Schema.String,
	description: Schema.String,
	userId: Schema.String,
}) {}

const createTodoProgram = (request: NextRequest) =>
	Effect.gen(function* () {
		const body = yield* Effect.tryPromise({
			try: () => request.json(),
			catch: () =>
				new ValidationError({ errors: { body: "Invalid JSON body" } }),
		});

		const todoData = yield* Schema.decodeUnknown(PostTodo)(body).pipe(
			Effect.mapError((parseError) => {
				const errors: Record<string, string> = {};

				errors.general = parseError.message || "Validation failed";

				return new ValidationError({ errors });
			}),
		);

		const repo = yield* TodoRepository;
		yield* repo.insertTodo(todoData);

		return todoData;
	});

export async function POST(request: NextRequest): Promise<NextResponse> {
	const program = createTodoProgram(request).pipe(
		Effect.map((todo) => NextResponse.json(todo, { status: 201 })),
		Effect.catchTags({
			ValidationError: (error) =>
				Effect.succeed(
					NextResponse.json({ errors: error.errors }, { status: 400 }),
				),
			DatabaseError: (error) =>
				Effect.succeed(
					NextResponse.json(
						{ error: "Database Error", message: error.message },
						{ status: 500 },
					),
				),
		}),
		Effect.provide(TodoRepositoryLive),
	);

	return Effect.runPromise(program);
}

export async function GET(): Promise<NextResponse> {
	const program = Effect.gen(function* () {
		const repo = yield* TodoRepository;
		const todos = yield* repo.getTodos;
		return todos;
	}).pipe(
		Effect.map((todos) => NextResponse.json(todos)),
		Effect.catchAll((error) => {
			if (error._tag === "DatabaseError") {
				return Effect.succeed(
					NextResponse.json(
						{ error: "Database Error", message: error.message },
						{ status: 500 },
					),
				);
			}

			return Effect.succeed(
				NextResponse.json(
					{ error: "Internal Server Error", message: "Failed to fetch todos" },
					{ status: 500 },
				),
			);
		}),
		Effect.provide(TodoRepositoryLive),
	);

	return Effect.runPromise(program);
}
