import { apiClient } from "@/lib/api-client";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type SignInResponse = Awaited<ReturnType<typeof apiClient.signIn>>;

interface User {
	id: number;
	email: string;
	name: string;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<SignInResponse>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_USER = "auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
		const storedUser = localStorage.getItem(STORAGE_KEY_USER);

		if (storedToken && storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setToken(storedToken);
				setUser(parsedUser);
				apiClient.setAuthToken(storedToken);
			} catch (error) {
				console.error("Failed to load auth from localStorage:", error);
				localStorage.removeItem(STORAGE_KEY_TOKEN);
				localStorage.removeItem(STORAGE_KEY_USER);
			}
		}
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		const response = await apiClient.signIn(email, password);
		const token = response.accessToken;
		apiClient.setAuthToken(token);
		setToken(token);
		setUser(response.user);

		localStorage.setItem(STORAGE_KEY_TOKEN, token);
		localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(response.user));

		return response;
	}, []);

	const logout = useCallback(() => {
		setUser(null);
		setToken(null);
		apiClient.clearAuthToken();

		localStorage.removeItem(STORAGE_KEY_TOKEN);
		localStorage.removeItem(STORAGE_KEY_USER);
	}, []);

	const value: AuthContextType = {
		user,
		token,
		isAuthenticated: !!token,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
