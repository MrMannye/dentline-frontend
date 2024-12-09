/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useState, useContext } from 'react';
import { redirect } from 'next/navigation'
import Web3 from 'web3';

interface WalletContextType {
	account: string | null;
	web3: Web3 | null;
	connectWallet: () => Promise<void>;
	dentist: DentistProps | null;
	setDentist: React.Dispatch<React.SetStateAction<DentistProps | null>>;
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
				const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/validDentist/${accounts[0]}`)
				const { data } = await response.json()
				const user: DentistProps = data[0];
				console.log(user)
				setDentist({
					id_dentista: user.id_dentista,
					nombre: user.nombre,
					especializacion: user.especializacion,
					telefono: user.telefono,
					email: user.email,
					numero_tarjeta: user.numero_tarjeta,
					cuenta_clabe: user.cuenta_clabe,
					wallet_address: user.wallet_address
				});
				redirect('/')
			} catch (error) {
				console.error("Error connecting to wallet:", error);
			}
		} else {
			console.log("Please install MetaMask!");
		}
	};

	return (
		<WalletContext.Provider value={{ account, web3, connectWallet, dentist, setDentist }}>
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