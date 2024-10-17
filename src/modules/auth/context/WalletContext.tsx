/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useState, useContext } from 'react';
import Web3 from 'web3';

interface WalletContextType {
	account: string | null;
	web3: Web3 | null;
	connectWallet: () => Promise<void>;
	dentist: DentistProps | null;
}

interface DentistProps {
	id_dentista: string;
	nombre: string | null;
	especializacion: string | null;
	telefono: string | null;
	email: string | null;
	numero_tarjeta: string | null;
	cuenta_clabe: string | null;
	wallet_address: string;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [account, setAccount] = useState<string | null>(null);
	const [dentist, setDentist] = useState<DentistProps | null>(null);
	const [web3, setWeb3] = useState<Web3 | null>(null);

	const connectWallet = async () => {
		if ((window as any).ethereum) {
			try {
				const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
				setAccount(accounts[0]);
				const web3Instance = new Web3((window as any).ethereum);
				setWeb3(web3Instance);
				setDentist({
					id_dentista: "1",
					nombre: "Dr. Juan Pérez",
					especializacion: "Ortodoncia",
					telefono: "555-1234",
					email: "juan.perez@dentista.com",
					numero_tarjeta: "1234567890123456",
					cuenta_clabe: "CL1234567890123456",
					wallet_address: accounts[0]
				});
			} catch (error) {
				console.error("Error connecting to wallet:", error);
			}
		} else {
			console.log("Please install MetaMask!");
		}
	};

	return (
		<WalletContext.Provider value={{ account, web3, connectWallet, dentist }}>
			{children}
		</WalletContext.Provider>
	);
};

export const useWallet = (): WalletContextType => {
	const context = useContext(WalletContext);
	if (!context) {
		throw new Error("useWallet must be used within a WalletProvider");
	}
	return context;
};