import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

export const Sidebar = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		auth.logout();
		await navigate({ to: "/entrar", search: { redirect: "/" } });
	};

	return (
		<aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
			<div className="p-6 border-b border-gray-200 shrink-0">
				<h2 className="text-xl font-bold text-gray-900">Carmen Perlin</h2>
				<p className="text-sm text-gray-500">Advogados</p>
			</div>

			<div className="flex-1 overflow-y-auto p-6">
				<div className="space-y-4">
					<div>
						<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
							Bem-vinda
						</p>
						<p className="mt-2 text-lg font-semibold text-gray-900">{auth.user?.name}</p>
						<p className="text-sm text-gray-600">{auth.user?.email}</p>
					</div>

					{/* <nav className="space-y-2 mt-8">
						<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
							Menu
						</p>
						<div className="text-sm text-gray-600">
							<span className="block py-2 px-3 rounded hover:bg-gray-100">Processos</span>
						</div>
					</nav> */}
				</div>
			</div>

			<div className="p-6 border-t border-gray-200 shrink-0">
				<Button
					onClick={handleLogout}
					variant="outline"
					className="w-full justify-start"
					size="sm"
				>
					<LogOut className="h-4 w-4 mr-2" />
					Sair
				</Button>
			</div>
		</aside>
	);
};
