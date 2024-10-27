import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useEffect, useState } from 'react';
import { useWallet } from '@/src/modules/auth/context/WalletContext';

import Link from 'next/link'

interface DatesRecap{
	id_cita: number,
	nombre_paciente: string,
	fecha_cita: string,
	costo_total: number,
	observaciones: string,
	hora_cita: string
}

export default function CardDate() {
	const [dataDates, setDataDates] = useState<DatesRecap[]>([]);
	const { dentist } = useWallet()
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/allDatesRecap/${dentist?.id_dentista}`)
			const data = await response.json()
			setDataDates(data.data)
		}
		fetchData()
	}, [dentist]);

	return (
		<>
			{dataDates.map((date) => {
				return (
					<Link href={`pacients/payment/${"Miguel Aguilera"}`} className='rounded-xl flex flex-col'>
						<span className='bg-acent-color text-white text-center rounded-t-xl tracking-wide'>{date.nombre_paciente}</span>
						<div className='text-xs mx-4 my-2 flex flex-col space-y-[3px]'>
							<h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>${date.costo_total}</span></h3>
							<h3 className='font-bold text-gray-700'>Fecha: <span className='font-normal text-gray-400'>{date.fecha_cita.split("T",1)}</span></h3>
							<h3 className='font-bold text-gray-700'>Hora: <span className='font-normal text-gray-400'>{date.hora_cita}</span></h3>
							<h3 className='font-bold text-gray-700'>Observaciones: <span className='font-normal text-gray-400'>{date.observaciones}</span></h3>
						</div>
						<div className='bg-primary-200 w-full flex items-center justify-around rounded-b-xl p-1'>
							<Link href={'/date'}><CalendarMonthIcon className='text-primary-color mx-3 text-base' /></Link>
							<DeleteIcon className='text-primary-color mx-3 text-base' />
						</div>
					</Link>
				)
			})}
		</>
	)
}
