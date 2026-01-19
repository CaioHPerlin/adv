import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";

interface CreateUserModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const queryClient = useQueryClient();

	const createUserMutation = useMutation({
		mutationFn: async () => {
			return apiClient.createUser({ email, name, password });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			setEmail("");
			setName("");
			setPassword("");
			onClose();
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email && name && password) {
			createUserMutation.mutate();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<Card className="p-6 w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Novo Usuário</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X className="h-5 w-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="name">Nome</Label>
						<Input
							id="name"
							type="text"
							placeholder="Nome completo"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="email@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<Label htmlFor="password">Senha</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div className="flex gap-2 justify-end pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={createUserMutation.isPending}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={createUserMutation.isPending}>
							{createUserMutation.isPending ? "Criando..." : "Criar Usuário"}
						</Button>
					</div>

					{createUserMutation.isError && (
						<div className="bg-red-100 text-red-700 p-2 rounded text-sm">
							Erro ao criar usuário. Tente novamente.
						</div>
					)}
				</form>
			</Card>
		</div>
	);
};
