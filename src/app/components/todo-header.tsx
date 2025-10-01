"use client";

import { CreateTodoForm } from "@/app/components/create-todo-form";

interface TodoHeaderProps {
	todoCount: number;
}

export function TodoHeader({ todoCount }: TodoHeaderProps) {
	return (
		<div className="flex items-center justify-between w-full">
			<h1 className="text-2xl font-bold">
				Your Todos {todoCount > 0 && `(${todoCount})`}
			</h1>
			<CreateTodoForm />
		</div>
	);
}

