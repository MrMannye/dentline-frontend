'use client'

import React, { createContext, useState, useContext } from 'react';
import { redirect } from 'next/navigation'
import Web3 from 'web3';

interface WalletContextType {
    account: string | null;
    web3: Web3 | null;
    connectWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [web3, setWeb3] = useState<Web3 | null>(null);

    const connectWallet = async () => {
        if ((window as any).ethereum) {
            try {
                const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                const web3Instance = new Web3((window as any).ethereum);
                setWeb3(web3Instance);
                redirect('/')
            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        } else {
            console.log("Please install MetaMask!");
        }
    };

    return (
        <WalletContext.Provider value={{ account, web3, connectWallet }}>
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