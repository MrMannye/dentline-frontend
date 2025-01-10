/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

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
	const router = useRouter();

	// Restaurar el estado desde localStorage al cargar y redirigir al home si existe
	useEffect(() => {
		const savedAccount = localStorage.getItem('account');
		const savedDentist = localStorage.getItem('dentist');

		if (savedAccount && savedDentist) {
			setAccount(savedAccount);
			setDentist(JSON.parse(savedDentist));
			router.push('/'); // Redirige automáticamente al home si ya está autenticado
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const connectWallet = async () => {
		try {
			const providerOptions = {
				walletconnect: {
					package: WalletConnectProvider,
					options: {
						rpc: {
							1: "https://mainnet.infura.io/v3/fc9b9d2f7c2d4f6f95cb900adb86b5dc",
						},
						qrcodeModalOptions: {
							mobileLinks: ["metamask"],
						},
					},
				},
			};

			const web3Modal = new Web3Modal({
				cacheProvider: true,
				providerOptions,
				theme: "dark",
			});

			const provider = await web3Modal.connect();
			const web3Instance = new Web3(provider);
			setWeb3(web3Instance);

			const accounts = await web3Instance.eth.getAccounts();
			setAccount(accounts[0]);
			localStorage.setItem('account', accounts[0]);

			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/validDentist/${accounts[0]}`);
			const { data } = await response.json();
			const user: DentistProps = data[0];

			const dentistData = {
				id_dentista: user.id_dentista,
				nombre: user.nombre,
				especializacion: user.especializacion,
				telefono: user.telefono,
				email: user.email,
				numero_tarjeta: user.numero_tarjeta,
				cuenta_clabe: user.cuenta_clabe,
				wallet_address: user.wallet_address,
			};

			setDentist(dentistData);
			localStorage.setItem('dentist', JSON.stringify(dentistData));

			router.push('/');
		} catch (error) {
			console.error("Error connecting to wallet:", error);
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
