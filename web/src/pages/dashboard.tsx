import { AssignUsersModal } from "@/components/assign-users-modal";
import { CreateCaseModal } from "@/components/create-case-modal";
import { CreateUserModal } from "@/components/create-user-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useApp } from "@/contexts/app";
import { useAuth } from "@/contexts/auth";
import { apiClient } from "@/lib/api-client";
import { printCasesReport } from "@/lib/report-generator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type CellContext,
	type ColumnDef,
	type ColumnFiltersState,
	type PaginationState,
	type SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, MoreHorizontal, Printer } from "lucide-react";
import { useMemo, useState } from "react";

interface Case {
	id: number;
	number: string;
	court: string;
	clientName: string;
	distributionDate: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	createdByUserId: number;
	assignedUsers?: Array<{
		user: {
			id: number;
			email: string;
			name: string;
		};
	}>;
}

const EditableCellComponent = ({ getValue, row, column }: CellContext<Case, unknown>) => {
	const [value, setValue] = useState(getValue() as string);
	const queryClient = useQueryClient();

	const updateMutation = useMutation({
		mutationFn: async (newValue: string) => {
			return apiClient.updateCase(row.original.id, {
				[column.id]: newValue,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cases"] });
		},
	});

	return (
		<input
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onBlur={() => {
				if (value !== getValue()) {
					updateMutation.mutate(value);
				}
			}}
			className="w-full px-2 py-1 border rounded"
		/>
	);
};

const AssignedUsersCell = ({ row }: CellContext<Case, unknown>) => {
	const users = row.original.assignedUsers || [];
	return (
		<div className="text-sm">
			{users.length > 0 ? (
				<div className="flex flex-col gap-1">
					{users.map((uc: any) => (
						<span key={uc.user.id} className="bg-blue-100 px-2 py-1 rounded">
							{uc.user.name}
						</span>
					))}
				</div>
			) : (
				<span className="text-gray-500">Nenhum usuário</span>
			)}
		</div>
	);
};

const ActionCell = ({
	row,
	onAssignUsersClick,
}: CellContext<Case, unknown> & {
	onAssignUsersClick?: (caseId: number, userIds: number[]) => void;
}) => {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: () => apiClient.deleteCase(row.original.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cases"] });
		},
	});

	const assignedUserIds = (row.original.assignedUsers || []).map((uc: any) => uc.user.id);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => onAssignUsersClick?.(row.original.id, assignedUserIds)}
				>
					Atribuir Usuários
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => deleteMutation.mutate()}
					className="text-red-600"
				>
					Deletar
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const DashboardPage = () => {
	const { isAuthenticated } = useAuth();
	const {
		isCreateUserModalOpen,
		closeCreateUserModal,
		isCreateCaseModalOpen,
		closeCreateCaseModal,
	} = useApp();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [globalFilter, setGlobalFilter] = useState("");
	const [isAssignUsersModalOpen, setIsAssignUsersModalOpen] = useState(false);
	const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
	const [selectedCaseUserIds, setSelectedCaseUserIds] = useState<number[]>([]);

	const columns: ColumnDef<Case>[] = [
		{
			accessorKey: "number",
			header: "Número do Processo",
			cell: EditableCellComponent,
		},
		{
			accessorKey: "court",
			header: "Tribunal",
			cell: EditableCellComponent,
		},
		{
			accessorKey: "clientName",
			header: "Nome do Cliente",
			cell: EditableCellComponent,
		},
		{
			accessorKey: "description",
			header: "Descrição",
			cell: EditableCellComponent,
		},
		{
			accessorKey: "distributionDate",
			header: "Data de Distribuição",
			cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString("pt-BR"),
		},
		{
			accessorKey: "assignedUsers",
			header: "Usuários Atribuídos",
			cell: AssignedUsersCell,
		},
		{
			id: "actions",
			header: "Ações",
			cell: (cellContext) => (
				<ActionCell
					{...cellContext}
					onAssignUsersClick={(caseId, userIds) => {
						setSelectedCaseId(caseId);
						setSelectedCaseUserIds(userIds);
						setIsAssignUsersModalOpen(true);
					}}
				/>
			),
		},
	];

	const { data: cases = [], isLoading } = useQuery({
		queryKey: ["cases"],
		queryFn: () => apiClient.getAllCases(),
		enabled: isAuthenticated,
	});

	const filteredCases = useMemo(() => {
		if (!globalFilter) return cases;
		return cases.filter((c) => {
			const assignedUsers = (c.assignedUsers || []).map((uc) => uc.user.name);

			return [c.number, c.court, c.clientName, c.description, ...assignedUsers].some(
				(field) => field?.toLowerCase().includes(globalFilter.toLowerCase()),
			);
		});
	}, [cases, globalFilter]);

	const table = useReactTable({
		data: filteredCases,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting,
			columnFilters,
			pagination,
			globalFilter,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
	});

	if (!isAuthenticated) {
		return null;
	}

	return (
		<>
			<div className="p-8">
				<div className="mb-4 flex justify-end">
					<Button onClick={() => printCasesReport(cases)} variant="outline" size="sm">
						<Printer className="h-4 w-4 mr-2" />
						Imprimir Relatório
					</Button>
				</div>
				<Card className="p-6">
					<div className="space-y-4">
						<div>
							<h1 className="text-2xl font-bold mb-2">Processos Judiciais</h1>
							<Input
								placeholder="Pesquisar por número, tribunal, cliente ou descrição..."
								value={globalFilter}
								onChange={(e) => setGlobalFilter(e.target.value)}
								className="mb-4"
							/>
						</div>

						{isLoading ? (
							<div className="text-center py-8">Carregando...</div>
						) : (
							<>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											{table.getHeaderGroups().map((headerGroup: any) => (
												<TableRow key={headerGroup.id}>
													{headerGroup.headers.map((header: any) => (
														<TableHead
															key={header.id}
															onClick={header.column.getToggleSortingHandler()}
															className={
																header.column.getCanSort()
																	? "cursor-pointer select-none"
																	: ""
															}
														>
															<div className="flex items-center gap-2">
																{flexRender(
																	header.column.columnDef.header,
																	header.getContext(),
																)}
																{header.column.getCanSort() && (
																	<span className="text-gray-400">
																		{header.column.getIsSorted() === "asc" ? (
																			<ChevronUp className="h-4 w-4" />
																		) : header.column.getIsSorted() === "desc" ? (
																			<ChevronDown className="h-4 w-4" />
																		) : (
																			<ChevronDown className="h-4 w-4 opacity-50" />
																		)}
																	</span>
																)}
															</div>
														</TableHead>
													))}
												</TableRow>
											))}
										</TableHeader>
										<TableBody>
											{table.getRowModel().rows.map((row: any) => (
												<TableRow key={row.id}>
													{row.getVisibleCells().map((cell: any) => (
														<TableCell key={cell.id}>
															{flexRender(cell.column.columnDef.cell, cell.getContext())}
														</TableCell>
													))}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>

								<div className="flex items-center justify-between">
									<div className="text-sm text-gray-600">
										Página {table.getState().pagination.pageIndex + 1} de{" "}
										{table.getPageCount()}
									</div>
									<div className="flex gap-2">
										<Button
											onClick={() => table.previousPage()}
											disabled={!table.getCanPreviousPage()}
											variant="outline"
											size="sm"
										>
											Anterior
										</Button>
										<Button
											onClick={() => table.nextPage()}
											disabled={!table.getCanNextPage()}
											variant="outline"
											size="sm"
										>
											Próxima
										</Button>
									</div>
								</div>
							</>
						)}
					</div>
				</Card>
			</div>

			<CreateUserModal isOpen={isCreateUserModalOpen} onClose={closeCreateUserModal} />

			<CreateCaseModal isOpen={isCreateCaseModalOpen} onClose={closeCreateCaseModal} />

			{selectedCaseId !== null && (
				<AssignUsersModal
					isOpen={isAssignUsersModalOpen}
					onClose={() => setIsAssignUsersModalOpen(false)}
					caseId={selectedCaseId}
					currentAssignedUserIds={selectedCaseUserIds}
				/>
			)}
		</>
	);
};
