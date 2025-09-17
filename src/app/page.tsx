import { Effect } from "effect";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTodos } from "@/app/actions";
import Todo from "@/app/components/todo";
import { CreateTodoDialog } from "@/components/create-todo-dialog";
import { TodoHeader } from "@/components/todo-header";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth");
	}

	const todos = await Effect.runPromise(getTodos);

	return (
		<div className="h-full w-full overflow-hidden">
			<div className="h-full overflow-auto">
				<div className="p-6 grid place-items-center">
					<section className="flex flex-col gap-8 items-center sm:items-start w-full max-w-2xl">
						<TodoHeader todoCount={todos.length} />
						{todos.length !== 0 ? (
							todos.map((todo) => <Todo key={todo.id} todo={todo} />)
						) : (
							<Alert className="w-full">
								<AlertDescription>
									You have no todos yet. Create one by clicking the &ldquo;New Todo&rdquo; button.
								</AlertDescription>
							</Alert>
						)}
					</section>
				</div>
			</div>
			<CreateTodoDialog />
		</div>
	);
}
