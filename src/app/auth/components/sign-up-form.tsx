"use client";

import { DynamicFormGroup, FieldConfigs } from "@/components/ui/dynamic-form";
import { signUpSchema, SignUpSchema } from "../schemas/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth-client";
import { convertImageToBase64 } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { IsLoading } from "../types";
import LegalDisclaimer from "./legal-disclaimer";
import SocialSignOn from "./social-sign-on";
import { toast } from "sonner";

const fieldConfigs: FieldConfigs<SignUpSchema> = {
	firstName: {
		label: "First name",
		type: "text",
		group: "name",
	},
	lastName: {
		label: "Last name",
		type: "text",
		group: "name",
	},
	email: {
		label: "Email",
		type: "email",
	},
	password: {
		label: "Password",
		type: "password",
		group: "password",
	},
	confirmPassword: {
		label: "Confirm password",
		type: "password",
		group: "password",
	},
	profileImage: {
		label: "Profile image (optional)",
		type: "file",
	},
} as const;

export default function SignUp() {
	const [isLoading, setIsLoading] = useState<IsLoading>({
		loading: false,
		type: "email",
	});
	const [error, setError] = useState<string | null>(null);

	const form = useForm<SignUpSchema>({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			profileImage: undefined,
		},
		resolver: zodResolver(signUpSchema),
	});

	async function handleSubmit(data: SignUpSchema) {
		await signUp.email({
			email: data.email,
			password: data.password,
			name: `${data.firstName} ${data.lastName}`,
			image: data.profileImage
				? await convertImageToBase64(data.profileImage)
				: "",
			callbackURL: "/",
			fetchOptions: {
				onError: (error) => setError(error.error.message),
				onRequest: () => setIsLoading({ loading: true, type: "email" }),
				onResponse: () => setIsLoading({ loading: false, type: "email" }),
				onSuccess: () => (toast.success("Successfully signed in!"), undefined),
			},
		});
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="backdrop-blur-md bg-card/75 dark:bg-card/5">
				<CardHeader>
					<CardTitle>Sign up</CardTitle>
					<CardDescription>Sign up with your Google account</CardDescription>
				</CardHeader>
				<CardContent>
					<SocialSignOn
						isLoading={isLoading}
						setIsLoading={setIsLoading}
						signUp
					/>
					<span className="block text-center text-sm mx-auto mt-10">
						Or continue with
					</span>
					<Separator className="mb-6" />
					<Form {...form}>
						{error && (
							<Alert variant={"destructive"} className="mb-5">
								<AlertTitle>Error signing up</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<div className="flex flex-col gap-4 mb-4">
								<DynamicFormGroup<SignUpSchema>
									fieldConfigs={fieldConfigs}
									control={form.control}
								/>
							</div>
							<Button
								type="submit"
								disabled={isLoading.loading && isLoading.type === "email"}
								className="w-full"
							>
								{isLoading.loading && isLoading.type === "email" && (
									<Loader2 className="h-4 w-4 animate-spin animation-all" />
								)}
								Sign up
							</Button>
						</form>
					</Form>
				</CardContent>

				<CardFooter className="gap-2 text-sm text-center">
					<span>Already have an account?</span>
					<Link href="/auth" className="underline underline-offset-4">
						Sign in
					</Link>
				</CardFooter>
			</Card>

			<LegalDisclaimer />
		</div>
	);
}
