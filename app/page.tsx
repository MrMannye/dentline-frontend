'use client'

import { useWallet } from "@/src/modules/auth/context/WalletContext";
import Dates from '../src/modules/home/Dates';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '../src/utils/Avatar'
import Image from 'next/image'

export default function Home() {
	const { account } = useWallet()

	return (
		<div className="flex-1 w-full">
			<div className='relative'>
				<Image src={"/img/home_logo.png"} className='absolute top-5 left-5' alt="Image Home" />
				<Image src={"/img/home_image.png"} className='w-full h-72' alt="Image Home" />
			</div>
			<h1>{account}</h1>
			<div className='p-2 mt-7'>
				<div className='flex justify-between font-bold items-center text-[#565656]'>
					<h1 className='text-xl'>Pacientes</h1>
					<AddIcon className='w-7 h-7 mr-7 text-[#565656]'></AddIcon>
				</div>

				<div className='flex justify-around items-center h-[72px] rounded-xl bg-primary-color mt-2'>
					<Avatar image={"/icons/pacient.svg"} />
					<div className='flex items-center text-white'>
						<span className='font-bold text-4xl'>235</span>
					</div>
					<CreateNewFolderIcon className='text-white'></CreateNewFolderIcon>
				</div>

				<div className='mt-5'>
					<h2 className='font-bold text-xl text-[#565656] mb-2'>Proximas citas</h2>
					<Dates></Dates>
				</div>
			</div>
		</div>
	);
}
