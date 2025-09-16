import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function signOut() {
	"use server";

	await auth.api.signOut({
		headers: await headers(),
	});

	redirect("/auth");
}

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth");
	}

	return (
		<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				Hello world
				<form action={signOut}>
					<Button type="submit">Sign out</Button>
				</form>
			</main>
		</div>
	);
}
