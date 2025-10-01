"use client";

import { Button } from "@/components/ui/button";
import { DynamicFormGroup, FieldConfigs } from "@/components/ui/dynamic-form";
import {
	createTodoSchema,
	CreateTodoSchema,
} from "../schemas/create-todo-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Loader2, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Todo } from "@/db/schemas";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";

const fieldConfigs: FieldConfigs<CreateTodoSchema> = {
	title: {
		label: "Title",
		type: "text",
		placeholder: "Enter todo title",
	},
	description: {
		label: "Description",
		type: "textarea",
		placeholder: "Enter todo description",
	},
} as const;

async function createTodo({
	data,
	userId,
}: {
	data: CreateTodoSchema;
	userId: string;
}) {
	const response = await fetch("/api/todos", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			...data,
			userId,
		}),
	});

	let json: unknown;
	try {
		json = await response.json();
	} catch (e) {
		throw new Error("Invalid JSON response: " + e);
	}

	if (!response.ok) {
		throw new Error("Failed to create todo");
	}

	return json as Todo;
}

export function CreateTodoForm() {
	const { data: sesion } = useSession();
	const queryClient = useQueryClient();

	const form = useForm<CreateTodoSchema>({
		defaultValues: {
			title: "",
			description: "",
		},
		resolver: zodResolver(createTodoSchema),
	});

	const {
		isError,
		error,
		isPending: isLoading,
		mutate,
	} = useMutation<Todo, Error, { data: CreateTodoSchema; userId: string }>({
		mutationFn: createTodo,
		onError: (error: Error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
			form.reset();
		},
	});

	async function handleSubmit(data: CreateTodoSchema) {
		const userId = sesion?.user.id;
		if (userId) {
			mutate({ data, userId });
			return;
		}

		toast.error("You must be logged in to create a todo");
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4" />
					New Todo
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Todo</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						{isError && (
							<Alert variant="destructive" className="mb-4">
								<AlertTitle>Error creating todo</AlertTitle>
								<AlertDescription>{error?.message}</AlertDescription>
							</Alert>
						)}

						<DynamicFormGroup<CreateTodoSchema>
							fieldConfigs={fieldConfigs}
							control={form.control}
						/>

						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
								Create Todo
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
