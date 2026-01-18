import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "./contexts/auth";
import { router } from "./router";

function InnerApp() {
	const auth = useAuth();
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} context={{ auth }} />
		</QueryClientProvider>
	);
}

export function App() {
	return (
		<AuthProvider>
			<InnerApp />
		</AuthProvider>
	);
}
