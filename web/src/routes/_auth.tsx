import { Sidebar } from "@/components/sidebar";
import { useApp } from "@/contexts/app";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useState } from "react";

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
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const { openCreateUserModal, openCreateCaseModal } = useApp();

	return (
		<div className="flex h-screen">
			<Sidebar
				isCollapsed={sidebarCollapsed}
				onCollapsedChange={setSidebarCollapsed}
				onCreateUserClick={openCreateUserModal}
				onCreateCaseClick={openCreateCaseModal}
			/>
			<main className="flex-1 overflow-y-auto bg-gray-50">
				<Outlet />
			</main>
		</div>
	);
}
