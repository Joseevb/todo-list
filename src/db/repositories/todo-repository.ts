import { Effect, Data, Context, Layer } from "effect";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { InsertTodo, todos, Todo } from "../schemas/todo-schema";

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
	readonly message: string;
	readonly cause?: unknown;
}> {}

export class NotFoundError extends Data.TaggedError("NotFoundError")<{
	readonly message: string;
}> {}

export interface TodoRepository {
	readonly getTodos: Effect.Effect<Todo[], DatabaseError>;
	readonly getTodoById: (
		id: string,
	) => Effect.Effect<Todo, DatabaseError | NotFoundError>;
	readonly insertTodo: (todo: InsertTodo) => Effect.Effect<void, DatabaseError>;
	readonly deleteTodo: (id: string) => Effect.Effect<void, DatabaseError>;
}

export const TodoRepository =
	Context.GenericTag<TodoRepository>("TodoRepository");

const todoRepositoryImpl: TodoRepository = {
	getTodos: Effect.tryPromise({
		try: () => db.select().from(todos),
		catch: (error) =>
			new DatabaseError({
				message: "Failed to get todos",
				cause: error,
			}),
	}),

	getTodoById: (id: string) =>
		Effect.tryPromise({
			try: () => db.select().from(todos).where(eq(todos.id, id)),
			catch: (error) =>
				new DatabaseError({
					message: `Failed to get todo by id: ${id}`,
					cause: error,
				}),
		}).pipe(
			Effect.flatMap((rows) =>
				rows.length > 0
					? Effect.succeed(rows[0])
					: Effect.fail(
							new NotFoundError({
								message: `Todo with id ${id} not found`,
							}),
						),
			),
		),

	insertTodo: (todo: InsertTodo) =>
		Effect.tryPromise({
			try: () => db.insert(todos).values(todo),
			catch: (error) =>
				new DatabaseError({
					message: "Failed to insert todo",
					cause: error,
				}),
		}).pipe(Effect.asVoid),

	deleteTodo: (id: string) =>
		Effect.tryPromise({
			try: () => db.delete(todos).where(eq(todos.id, id)),
			catch: (error) =>
				new DatabaseError({
					message: `Failed to delete todo with id: ${id}`,
					cause: error,
				}),
		}),
};

export const TodoRepositoryLive = Layer.succeed(
	TodoRepository,
	todoRepositoryImpl,
);

export const todoRepository = todoRepositoryImpl;
