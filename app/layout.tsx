'use client'

import "./globals.css";
import Navigation from "@/src/modules/layout/components/Navigation";
import Menu from "@/src/modules/layout/components/Menu";
import { WalletProvider } from "@/src/modules/auth/context/WalletContext";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="en">
			<body className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center my-16">
				<WalletProvider>
					<Navigation />
					{children}
					<Menu />
				</WalletProvider>
			</body>
		</html>
	);
} 
