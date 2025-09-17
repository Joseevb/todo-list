"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateTodoDialog() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const handleOpenDialog = () => {
			setOpen(true);
		};

		window.addEventListener("openCreateTodoDialog", handleOpenDialog);

		return () => {
			window.removeEventListener("openCreateTodoDialog", handleOpenDialog);
		};
	}, []);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Create New Todo</SheetTitle>
					<SheetDescription>
						Add a new todo item to your list.
					</SheetDescription>
				</SheetHeader>
				<form action="/api/create-todo" method="post" className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							name="title"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							required
						/>
					</div>
					<SheetFooter>
						<Button type="submit">Create Todo</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}