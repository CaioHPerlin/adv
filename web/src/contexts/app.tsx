import React, { createContext, useCallback, useContext, useState } from "react";

export interface AppContextType {
	isCreateUserModalOpen: boolean;
	openCreateUserModal: () => void;
	closeCreateUserModal: () => void;
	isCreateCaseModalOpen: boolean;
	openCreateCaseModal: () => void;
	closeCreateCaseModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
	const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState(false);

	const openCreateUserModal = useCallback(() => {
		setIsCreateUserModalOpen(true);
	}, []);

	const closeCreateUserModal = useCallback(() => {
		setIsCreateUserModalOpen(false);
	}, []);

	const openCreateCaseModal = useCallback(() => {
		setIsCreateCaseModalOpen(true);
	}, []);

	const closeCreateCaseModal = useCallback(() => {
		setIsCreateCaseModalOpen(false);
	}, []);

	const value: AppContextType = {
		isCreateUserModalOpen,
		openCreateUserModal,
		closeCreateUserModal,
		isCreateCaseModalOpen,
		openCreateCaseModal,
		closeCreateCaseModal,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useApp must be used within AppProvider");
	}
	return context;
};
