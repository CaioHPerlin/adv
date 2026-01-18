import React, { createContext, useContext, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);

	const login = useCallback(async (email: string, password: string) => {
		const response = await apiClient.signIn(email, password);
		const token = response.accessToken;
		apiClient.setAuthToken(token);
		setToken(token);
		setUser(response.user);
		return response;
	}, []);

	const logout = useCallback(() => {
		setUser(null);
		setToken(null);
		apiClient.clearAuthToken();
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
