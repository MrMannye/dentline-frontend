'use client';

import { Avatar } from '@mui/material'
import Link from 'next/link';
import React, { useEffect } from 'react'

import { obtenerCitasPorPaciente } from '../../../../src/modules/contracts/contrato';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataPacient } from '@/src/utils/types';

export default function Historial({ params }: { params: DataPacient }) {
	// const [historial, setHistorial] = useState([])
	const idPaciente = params.username.split("_")[1];

	useEffect(() => {
		console.log(parseInt(idPaciente))
		const fetchData = async () => {
			const response = await obtenerCitasPorPaciente(parseInt(idPaciente))
			console.log(response)
		}
		fetchData()
	}, [idPaciente]);


	return (
		<div className='w-full flex-1'>
			<div className='flex items-center justify-around w-full bg-secundary-color text-white p-2'>
				<Link className='' href={`/pacients/${params.username}`}>
					<h3 className='text-center'>PERFIL</h3>
				</Link>
				<h3 className='text-center'>DATOS</h3>
				<h3 className='text-center'>HISTORIAL</h3>
			</div>

			<div className='relative w-full bg-primary-color flex flex-col items-center text-white py-8'>
				<Avatar alt="Image Avatar"
					src={"/img/home_image.png"}
					sx={{ width: 82, height: 82 }} />
				<h2 className="text-2xl mt-2">{params.username}</h2>
				<span className='text-sm'>Paciente desde 2012</span>
			</div>

			<div className='mt-8 mx-4 space-y-6'>
				{[1, 2, 3, 4].map((option) => {
					return (
						<div className='rounded-xl flex flex-col' key={option}>
							<span className='bg-acent-color text-white text-center rounded-t-xl'>{"Enero 12 de 2022 - 10:45 AM"}</span>
							<div className='text-xs mx-4 my-2 text-gray-400 flex flex-col'>
								<h2 className='uppercase font-bold text-gray-700 mb-1'>Procedimientos:</h2>
								<span>15 - Endodoncia</span>
								<span>27, 31 - Aplicacion de Amalgama</span>
							</div>
							<hr />
							<div className='text-xs mx-4 my-2 flex flex-col space-y-[3px]'>
								<h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>$2500.00</span></h3>
								<h3 className='font-bold text-gray-700'>Fecha: <span className='font-normal text-gray-400'>12 de enero de 2022</span></h3>
								<h3 className='font-bold text-gray-700'>Notas: <span className='font-normal text-gray-400'>
									Por lo menos la mitad de la superficie del diente está destruida por la caries, y la pulpa
									puede estar afectada.
								</span>
								</h3>
							</div>
							<div className='bg-primary-200 w-full flex flex-row-reverse rounded-b-xl p-1'>
								<DeleteIcon className='text-primary-color mx-3 text-base' />
							</div>
						</div>
					)
				})}
			</div>

		</div>
	)
}
