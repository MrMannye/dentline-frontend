import React from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { usePathname, useRouter, redirect } from 'next/navigation';
import { useWallet } from '../../auth/context/WalletContext';

export default function Navigation() {

	const routerPath = usePathname();
	const {account} = useWallet()
	if(!account && routerPath !== '/login') redirect('/login')

	const router = useRouter();

	const titleNavigation = (): string => {
		if (routerPath.includes("pacients")) return "Pacientes";
		if (routerPath.includes("dates")) return "Citas";
		if (routerPath.includes("myaccount")) return "MI cuenta";
		if (routerPath.includes("consult")) return "Consulta";
		if (routerPath.includes("ficha")) return "Ficha dental";
		else return ""
	}

	return (
		<div className='bg-primary-color h-16 items-center flex justify-between px-8 text-white fixed top-0 z-50 w-[28rem]'>
			<div className='flex items-center space-x-4'>
				<ArrowBackIcon onClick={router.back} />
				<h1 className='font-medium text-xl tracking-wide'>{titleNavigation()}</h1>
			</div>
			{
				(routerPath.includes("ficha")) ?
					<div className='flex items-center space-x-4 justify-between'>
						<AutorenewIcon />
					</div>
					:
					<div className='flex items-center space-x-4 justify-between'>
						<SearchIcon />
						<MoreVertIcon />
					</div>
			}
		</div>
	)
}
