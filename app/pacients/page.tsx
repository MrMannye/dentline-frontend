'use client'

import React from 'react'
import Link from 'next/link';

import Avatar from '../../src/utils/Avatar';
import { Fab } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { useEffect, useState } from 'react';
import { useWallet } from '@/src/modules/auth/context/WalletContext';

interface Paciente {
	id_paciente: number;
	nombre_paciente: string;
}

export default function Pacients() {

	const { dentist } = useWallet()
	const [pacientes, setPacientes] = useState<Paciente[]>([])
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/allPacients/${dentist?.id_dentista}`)
			const data = await response.json()
			setPacientes(data.data);
		}
		fetchData()
	}, [dentist]);

	const listArray: Array<string> = [];
	const addtoArray = (letter: string): string => {
		if (!listArray.includes(letter)) {
			listArray.push(letter);
			return letter;
		} else {
			return "";
		}
	}

	return (
		<div className='px-4 space-y-4 w-full flex-1'>
			{pacientes.map((paciente) => {
				return (
					<div key={paciente.id_paciente} className="flex items-center space-x-4">
						<span className='text-3xl font-normal text-acent-color w-5'>{addtoArray(paciente.nombre_paciente.charAt(0))}</span>
						<Link href={`/pacients/${paciente.nombre_paciente}`} className="flex items-center space-x-4">
							<Avatar image={"/img/home_image.png"} />
							<span className='text-base'>{paciente.nombre_paciente}</span>
						</Link>
					</div>
				)
			})}
			<div className='fixed right-7 bottom-32'>
				<Fab aria-label="add" size='large' color='primary'>
					<PersonAddIcon className='text-white' />
				</Fab>
			</div>
		</div>
	)
}
