'use client'

import "./globals.css";
import Navigation from "@/src/modules/layout/components/Navigation";
import Menu from "@/src/modules/layout/components/Menu";
import { WalletProvider } from "@/src/modules/auth/context/WalletContext";
import { usePathname } from "next/navigation";
import { PatientProvider } from "@/src/modules/patients/context/PatientContext";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname()
	return (
		<html lang="en">
			<body className={`max-w-md mx-auto min-h-screen flex flex-col items-center justify-center ${pathname !== '/login' && 'my-16'}`}>
				<WalletProvider>
					<PatientProvider>
						{pathname !== '/login' && <Navigation />}
						{children}
						{pathname !== '/login' && <Menu />}
					</PatientProvider>
				</WalletProvider>
			</body>
		</html>
	);
}