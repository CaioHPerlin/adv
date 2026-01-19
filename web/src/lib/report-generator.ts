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

export const generateCasesReport = (cases: Case[]): string => {
	const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");

	const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Relatório de Processos Judiciais</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		
		body {
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			background: white;
			padding: 10px;
			color: #333;
		}
		
		.header {
			text-align: center;
			margin-bottom: 12px;
			border-bottom: 2px solid #1f2937;
			padding-bottom: 8px;
		}
		
		.header h1 {
			font-size: 20px;
			margin-bottom: 2px;
			color: #1f2937;
		}
		
		.header p {
			color: #666;
			font-size: 11px;
			margin: 1px 0;
		}
		
		.summary {
			background: #f3f4f6;
			padding: 8px;
			border-radius: 4px;
			margin-bottom: 12px;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 10px;
		}
		
		.summary-item {
			padding: 4px 0;
		}
		
		.summary-item strong {
			color: #1f2937;
			font-size: 11px;
			display: block;
			margin-bottom: 2px;
		}
		
		.summary-item span {
			font-size: 18px;
			color: #3b82f6;
			font-weight: bold;
		}
		
		table {
			width: 100%;
			border-collapse: collapse;
			margin-bottom: 12px;
			page-break-inside: avoid;
			font-size: 11px;
		}
		
		thead {
			background: #1f2937;
			color: white;
		}
		
		th {
			padding: 6px 4px;
			text-align: left;
			font-weight: 600;
			font-size: 10px;
			border: 1px solid #1f2937;
		}
		
		td {
			padding: 4px 4px;
			border: 1px solid #e5e7eb;
			font-size: 10px;
			word-wrap: break-word;
		}
		
		tbody tr:nth-child(even) {
			background: #f9fafb;
		}
		
		tbody tr:hover {
			background: #f3f4f6;
		}
		
		.case-number {
			font-weight: 600;
			color: #1f2937;
		}
		
		.users-list {
			display: flex;
			flex-direction: column;
			gap: 5px;
		}
		
		.user-badge {
			background: #dbeafe;
			color: #1e40af;
			padding: 4px 8px;
			border-radius: 4px;
			font-size: 12px;
			display: inline-block;
			width: fit-content;
		}
		
		.no-users {
			color: #999;
			font-style: italic;
		}
		
		.footer {
			text-align: center;
			margin-top: 30px;
			padding-top: 20px;
			border-top: 1px solid #e5e7eb;
			color: #666;
			font-size: 12px;
		}
		
		@media print {
			body {
				padding: 0;
			}
			
			table {
				page-break-inside: auto;
			}
			
			tr {
				page-break-inside: avoid;
			}
		}
	</style>
</head>
<body>
	<div class="header">
		<h1>Relatório de Processos Judiciais</h1>
		<p>Carmen Perlin - Advogados</p>
		<p>Gerado em ${formatDate(new Date().toISOString())}</p>
	</div>
	
	<div class="summary">
		<div class="summary-item">
			<strong>Total de Processos</strong>
			<span>${cases.length}</span>
		</div>
		<div class="summary-item">
			<strong>Tribunais Únicos</strong>
			<span>${new Set(cases.map((c) => c.court)).size}</span>
		</div>
		<div class="summary-item">
			<strong>Clientes Únicos</strong>
			<span>${new Set(cases.map((c) => c.clientName)).size}</span>
		</div>
	</div>
	
	<table>
		<thead>
			<tr>
				<th>Número do Processo</th>
				<th>Tribunal</th>
				<th>Cliente</th>
				<th>Data de Distribuição</th>
				<th>Usuários Atribuídos</th>
				<th>Descrição</th>
			</tr>
		</thead>
		<tbody>
			${cases
				.map(
					(caseItem) => `
				<tr>
					<td class="case-number">${caseItem.number}</td>
					<td>${caseItem.court}</td>
					<td>${caseItem.clientName}</td>
					<td>${formatDate(caseItem.distributionDate)}</td>
					<td>
						${
							caseItem.assignedUsers && caseItem.assignedUsers.length > 0
								? `<div class="users-list">${caseItem.assignedUsers
										.map((uc) => `<span class="user-badge">${uc.user.name}</span>`)
										.join("")}</div>`
								: '<span class="no-users">Nenhum usuário</span>'
						}
					</td>
					<td>${caseItem.description || "-"}</td>
				</tr>
			`,
				)
				.join("")}
		</tbody>
	</table>
	
	<div class="footer">
		<p>Este é um documento confidencial gerado automaticamente pelo sistema.</p>
	</div>
</body>
</html>
	`;

	return html;
};

export const printCasesReport = (cases: Case[]) => {
	const html = generateCasesReport(cases);
	const printWindow = window.open("", "", "width=1200,height=800");

	if (printWindow) {
		printWindow.document.write(html);
		printWindow.document.close();
		printWindow.onload = () => {
			printWindow.print();
		};
	}
};
