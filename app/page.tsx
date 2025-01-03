/* eslint-disable @next/next/no-img-element */
'use client'
import Dates from '../src/modules/home/Dates';
import Avatar from '../src/utils/Avatar'

export default function Home() {

	return (
		<div className="flex-1 w-full">
			<div className='relative'>
				<img src={"/img/home_logo.png"} className='absolute top-5 left-5' alt="Image Home" />
				<img src={"/img/home_image.png"} className='w-full h-72' alt="Image Home" />
			</div>
			<div className='p-2 mt-7'>
				<div className='flex justify-between font-bold items-center text-[#565656]'>
					<h1 className='text-xl'>Pacientes</h1>
				</div>

				<div className='flex justify-around items-center h-[72px] rounded-xl bg-primary-color mt-2'>
					<Avatar image={"/icons/pacient.svg"} />
					<div className='flex items-center text-white'>
						<span className='font-bold text-4xl'>235</span>
					</div>
				</div>

				<div className='mt-5'>
					<h2 className='font-bold text-xl text-[#565656] mb-2'>Proximas citas</h2>
					<Dates></Dates>
				</div>
			</div>
		</div>
	);
}