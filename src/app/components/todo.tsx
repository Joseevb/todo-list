"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Todo as TodoSchema } from "@/db/schemas";

export default function Todo({ todo }: { todo: TodoSchema }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{todo.title}</CardTitle>
			</CardHeader>
			<CardContent>
				{todo.description}
				{todo.completed ? "✅" : "❌"}
			</CardContent>
		</Card>
	);
}
