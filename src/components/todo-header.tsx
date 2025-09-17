"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TodoHeaderProps {
	todoCount: number;
}

export function TodoHeader({ todoCount }: TodoHeaderProps) {
	const handleNewTodo = () => {
		const event = new CustomEvent("openCreateTodoDialog");
		window.dispatchEvent(event);
	};

	return (
		<div className="flex items-center justify-between w-full">
			<h1 className="text-2xl font-bold">
				Your Todos {todoCount > 0 && `(${todoCount})`}
			</h1>
			<Button
				onClick={handleNewTodo}
				className="flex items-center gap-2"
			>
				<Plus className="h-4 w-4" />
				New Todo
			</Button>
		</div>
	);
}