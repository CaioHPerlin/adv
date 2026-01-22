import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";

interface CreateCaseModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const CreateCaseModal = ({ isOpen, onClose }: CreateCaseModalProps) => {
	const [number, setNumber] = useState("");
	const [court, setCourt] = useState("");
	const [clientName, setClientName] = useState("");
	const [description, setDescription] = useState("");
	const [distributionDate, setDistributionDate] = useState("");
	const queryClient = useQueryClient();

	const createCaseMutation = useMutation({
		mutationFn: async () => {
			return apiClient.createCase({
				number,
				court,
				clientName,
				description,
				distributionDate,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cases"] });
			setNumber("");
			setCourt("");
			setClientName("");
			setDescription("");
			setDistributionDate("");
			onClose();
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (number && court && clientName && distributionDate) {
			createCaseMutation.mutate();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
			<Card className="p-6 w-full max-w-md max-h-96 overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Novo Processo</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X className="h-5 w-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="number">Número do Processo</Label>
						<Input
							id="number"
							type="text"
							placeholder="Ex: 12345678"
							value={number}
							onChange={(e) => setNumber(e.target.value)}
							required
						/>
					</div>

					<div>
						<Label htmlFor="court">Tribunal</Label>
						<Input
							id="court"
							type="text"
							placeholder="Ex: Tribunal de Justiça"
							value={court}
							onChange={(e) => setCourt(e.target.value)}
							required
						/>
					</div>

					<div>
						<Label htmlFor="clientName">Nome do Cliente</Label>
						<Input
							id="clientName"
							type="text"
							placeholder="Ex: João da Silva"
							value={clientName}
							onChange={(e) => setClientName(e.target.value)}
							required
						/>
					</div>

					<div>
						<Label htmlFor="distributionDate">Data de Distribuição</Label>
						<Input
							id="distributionDate"
							type="date"
							value={distributionDate}
							onChange={(e) => setDistributionDate(e.target.value)}
							required
						/>
					</div>

					<div>
						<Label htmlFor="description">Descrição</Label>
						<textarea
							id="description"
							placeholder="Descrição do processo"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
							rows={3}
						/>
					</div>

					<div className="flex gap-2 justify-end pt-4 border-t">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={createCaseMutation.isPending}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={createCaseMutation.isPending}>
							{createCaseMutation.isPending ? "Criando..." : "Criar Processo"}
						</Button>
					</div>

					{createCaseMutation.isError && (
						<div className="bg-red-100 text-red-700 p-2 rounded text-sm">
							Erro ao criar processo. Tente novamente.
						</div>
					)}
				</form>
			</Card>
		</div>
	);
};
