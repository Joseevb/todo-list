"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Plus } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AppSidebar() {
	const { data: session } = useSession();

	const router = useRouter();

	const handleSignOut = async () => {
		await signOut();
		router.push("/auth");
	};

	const handleSignIn = () => router.push("/auth");

	const handleNewTodo = () => {
		// This will be handled by opening a dialog
		const event = new CustomEvent("openCreateTodoDialog");
		window.dispatchEvent(event);
	};

	return (
		<Sidebar className="border-r-0">
			<SidebarHeader>
				<h2 className="text-lg font-semibold px-2">Todo App</h2>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton onClick={handleNewTodo}>
									<Plus className="h-4 w-4" />
									New Todo
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex items-center justify-between px-2">
					{session ? (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleSignIn}
							className="flex items-center gap-2"
						>
							<LogIn className="h-4 w-4" />
							Sign In
						</Button>
					) : (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleSignOut}
							className="flex items-center gap-2"
						>
							<LogOut className="h-4 w-4" />
							Sign Out
						</Button>
					)}
					<ModeToggle />
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
