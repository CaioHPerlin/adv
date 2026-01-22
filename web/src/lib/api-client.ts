import type { AxiosInstance } from "axios";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface SignInResponse {
	accessToken: string;
	user: {
		id: number;
		email: string;
		name: string;
	};
}

interface User {
	id: number;
	email: string;
	name: string;
}

interface CreateUserPayload {
	email: string;
	name: string;
	password: string;
}

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
	assignedUsers?: {
		user: {
			id: number;
			email: string;
			name: string;
		};
	}[];
}

interface CreateCasePayload {
	number: string;
	court: string;
	clientName: string;
	distributionDate: string;
	description: string;
}

interface UpdateCasePayload {
	number?: string;
	court?: string;
	clientName?: string;
	distributionDate?: string;
	description?: string;
}

class ApiClient {
	private client: AxiosInstance;
	private authToken: string | null = null;

	constructor() {
		this.client = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Ensure the Authorization header is attached to every request if we have a token
		this.client.interceptors.request.use((config) => {
			if (this.authToken) {
				config.headers = config.headers || {};
				config.headers.Authorization = `Bearer ${this.authToken}`;
			}
			return config;
		});
	}

	setAuthToken(token: string) {
		this.authToken = token;
		this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	}

	clearAuthToken() {
		this.authToken = null;
		delete this.client.defaults.headers.common["Authorization"];
	}

	// Auth endpoints
	async signIn(email: string, password: string): Promise<SignInResponse> {
		const response = await this.client.post<SignInResponse>("/auth/sign-in", {
			email,
			password,
		});
		return response.data;
	}

	// Cases endpoints
	async getAllCases(): Promise<Case[]> {
		const response = await this.client.get<Case[]>("/cases");
		return response.data;
	}

	async getCaseById(id: number): Promise<Case> {
		const response = await this.client.get<Case>(`/cases/${id}`);
		return response.data;
	}

	async createCase(payload: CreateCasePayload): Promise<Case> {
		const response = await this.client.post<Case>("/cases", payload);
		return response.data;
	}

	async updateCase(id: number, payload: UpdateCasePayload): Promise<Case> {
		const response = await this.client.patch<Case>(`/cases/${id}`, payload);
		return response.data;
	}

	async deleteCase(id: number): Promise<void> {
		await this.client.delete(`/cases/${id}`);
	}

	async assignUsersToCase(caseId: number, userIds: number[]): Promise<Case> {
		const response = await this.client.post<Case>(`/cases/${caseId}/assign-users`, {
			userIds,
		});
		return response.data;
	}

	// Users endpoints
	async getAllUsers(): Promise<User[]> {
		const response = await this.client.get<User[]>("/users");
		return response.data;
	}

	async getUserById(id: number): Promise<User> {
		const response = await this.client.get<User>(`/users/${id}`);
		return response.data;
	}

	async createUser(payload: CreateUserPayload): Promise<User> {
		const response = await this.client.post<User>("/users", payload);
		return response.data;
	}
}

export const apiClient = new ApiClient();
