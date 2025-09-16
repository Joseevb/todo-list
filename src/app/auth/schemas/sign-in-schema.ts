import z from "zod";

export const signInSchema = z.object({
	email: z.email().nonempty().nonoptional(),
	password: z.string().nonempty().nonoptional(),
	rememberMe: z.boolean().optional(),
});

export type SignInSchema = z.infer<typeof signInSchema>;
