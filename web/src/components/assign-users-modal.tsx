import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface AssignUsersModalProps {
	isOpen: boolean;
	onClose: () => void;
	caseId: number;
	currentAssignedUserIds?: number[];
}

export const AssignUsersModal = ({
	isOpen,
	onClose,
	caseId,
	currentAssignedUserIds = [],
}: AssignUsersModalProps) => {
	const [selectedUserIds, setSelectedUserIds] =
		useState<number[]>(currentAssignedUserIds);
	const queryClient = useQueryClient();

	const { data: users = [] } = useQuery({
		queryKey: ["users"],
		queryFn: () => apiClient.getAllUsers(),
	});

	useEffect(() => {
		setSelectedUserIds(currentAssignedUserIds);
	}, [currentAssignedUserIds, isOpen]);

	const assignUsersMutation = useMutation({
		mutationFn: async () => {
			return apiClient.assignUsersToCase(caseId, selectedUserIds);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cases"] });
			onClose();
		},
	});

	const handleToggleUser = (userId: number) => {
		setSelectedUserIds((prev) =>
			prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		assignUsersMutation.mutate();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<Card className="p-6 w-full max-w-md max-h-96 overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Atribuir Usuários</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X className="h-5 w-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-3">
						{users.length > 0 ? (
							users.map((user) => (
								<label
									key={user.id}
									className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer"
								>
									<input
										type="checkbox"
										checked={selectedUserIds.includes(user.id)}
										onChange={() => handleToggleUser(user.id)}
										className="h-4 w-4 rounded border-gray-300"
									/>
									<div className="flex-1">
										<p className="font-medium text-sm">{user.name}</p>
										<p className="text-xs text-gray-500">{user.email}</p>
									</div>
								</label>
							))
						) : (
							<p className="text-gray-500 text-sm">Nenhum usuário disponível</p>
						)}
					</div>

					<div className="flex gap-2 justify-end pt-4 border-t">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={assignUsersMutation.isPending}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={assignUsersMutation.isPending}>
							{assignUsersMutation.isPending ? "Salvando..." : "Salvar"}
						</Button>
					</div>

					{assignUsersMutation.isError && (
						<div className="bg-red-100 text-red-700 p-2 rounded text-sm">
							Erro ao atribuir usuários. Tente novamente.
						</div>
					)}
				</form>
			</Card>
		</div>
	);
};
