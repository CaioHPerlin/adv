import { Sidebar } from "@/components/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context, location }) => {
		console.log({ auth: context.auth });
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/entrar",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div className="flex h-screen">
			<Sidebar />
			<main className="flex-1 overflow-y-auto bg-gray-50">
				<Outlet />
			</main>
		</div>
	);
}
