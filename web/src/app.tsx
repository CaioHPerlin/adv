import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { AppProvider } from "./contexts/app";
import { AuthProvider, useAuth } from "./contexts/auth";
import { router } from "./router";

function InnerApp() {
	const auth = useAuth();
	const queryClient = new QueryClient();

	return (
		<AppProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} context={{ auth }} />
			</QueryClientProvider>
		</AppProvider>
	);
}

export function App() {
	return (
		<AuthProvider>
			<InnerApp />
		</AuthProvider>
	);
}
