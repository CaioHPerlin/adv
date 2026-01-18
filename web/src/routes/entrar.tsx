import { SignInPage } from "@/pages/sign-in";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/entrar")({
	validateSearch: (search) => ({
		redirect: (search.redirect as string) || "/",
	}),
	beforeLoad: async ({ context, search }) => {
		if (context.auth.isAuthenticated) {
			throw redirect({ to: search.redirect as string });
		}
	},
	component: SignInPage,
});
