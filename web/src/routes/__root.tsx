import type { AuthContextType } from "@/contexts/auth";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface RootRouterContext {
	auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RootRouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<Outlet />
			{/* <TanStackRouterDevtools /> */}
		</>
	);
}
