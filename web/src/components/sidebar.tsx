import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, FileText, LogOut, Plus } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
	isCollapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	onCreateUserClick?: () => void;
	onCreateCaseClick?: () => void;
}

export const Sidebar = ({
	isCollapsed = false,
	onCollapsedChange,
	onCreateUserClick,
	onCreateCaseClick,
}: SidebarProps) => {
	const auth = useAuth();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(isCollapsed);

	const handleLogout = async () => {
		auth.logout();
		await navigate({ to: "/entrar", search: { redirect: "/" } });
	};

	const handleToggleCollapse = () => {
		const newState = !collapsed;
		setCollapsed(newState);
		onCollapsedChange?.(newState);
	};

	return (
		<aside
			className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
				collapsed ? "w-20" : "w-64"
			}`}
		>
			<div className="p-6 border-b border-gray-200 shrink-0">
				{!collapsed && (
					<>
						<h2 className="text-xl font-bold text-gray-900">Carmen Perlin</h2>
						<p className="text-sm text-gray-500">Advogados</p>
					</>
				)}
			</div>

			<div className="flex-1 overflow-y-auto p-6">
				<div className="space-y-4">
					{!collapsed && (
						<div>
							<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
								Bem-vinda
							</p>
							<p className="mt-2 text-lg font-semibold text-gray-900">
								{auth.user?.name}
							</p>
							<p className="text-sm text-gray-600">{auth.user?.email}</p>
						</div>
					)}

					{!collapsed && (
						<>
							<Button
								onClick={onCreateCaseClick}
								variant="outline"
								className="w-full justify-start"
								size="sm"
							>
								<FileText className="h-4 w-4 mr-2" />
								Novo Processo
							</Button>
							<Button
								onClick={onCreateUserClick}
								variant="outline"
								className="w-full justify-start"
								size="sm"
							>
								<Plus className="h-4 w-4 mr-2" />
								Novo Usuário
							</Button>
						</>
					)}
				</div>
			</div>

			<div className="p-6 border-t border-gray-200 shrink-0 space-y-2">
				{!collapsed && (
					<Button
						onClick={handleLogout}
						variant="outline"
						className="w-full justify-start"
						size="sm"
					>
						<LogOut className="h-4 w-4 mr-2" />
						Sair
					</Button>
				)}
				<Button
					onClick={handleToggleCollapse}
					variant="outline"
					className="w-full justify-center"
					size="sm"
				>
					{collapsed ? (
						<ChevronRight className="h-4 w-4" />
					) : (
						<ChevronLeft className="h-4 w-4" />
					)}
				</Button>
			</div>
		</aside>
	);
};
