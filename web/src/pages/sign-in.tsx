import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useState } from "react";

export const SignInPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const auth = useAuth();
	const router = useRouter();
	const search = useSearch({ from: "/entrar" });
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		try {
			await auth.login(email, password);
			await router.invalidate();
			await navigate({ to: search.redirect || "/" });
		} catch (err) {
			setError(
				isAxiosError(err)
					? err.response?.data.message
					: "Falha ao fazer login. Por favor, tente novamente.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Card className="w-full max-w-md p-8">
				<div className="space-y-6">
					<div className="space-y-2 text-center">
						<h1 className="text-3xl font-bold">Carmen Perlin Advogados</h1>
						<p className="text-gray-600">Faça login para acessar o painel</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
								{error}
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="seuemail@carmenperlin.adv.br"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Senha</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Entrando..." : "Entrar"}
						</Button>
					</form>
				</div>
			</Card>
		</div>
	);
};
