"use client";

import { ReactNode } from "react";
import {
	QueryClient,
	QueryClientProvider as Provider,
} from "@tanstack/react-query";

let globalQueryClient: QueryClient | undefined;

export function QueryClientProvider({ children }: { children: ReactNode }) {
	if (!globalQueryClient) {
		globalQueryClient = new QueryClient();
	}

	return <Provider client={globalQueryClient}>{children}</Provider>;
}
