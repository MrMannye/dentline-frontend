'use client'

import React, { useEffect, useState } from 'react'
import CardDate from './components/CardDate'
import { useWallet } from '../auth/context/WalletContext'

interface Pacient {
	nombre_paciente: string;
	profesion: string;
	fecha_cita: string;
	id_cita: number;
}

export default function Dates() {

	const { dentist } = useWallet()
	const [pacients, setPacients] = useState<Pacient[]>([])
	useEffect(() => {
		const fetchData = async () => {
			console.log(process.env.NEXT_PUBLIC_API, dentist?.id_dentista)
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/nextDate/${dentist?.id_dentista}`)
			const { data } = await response.json()
			console.log(data)
			setPacients(data)
		}
		fetchData()
	}, [dentist])

	const getHourFromDate = (date: string) => {
		const hour = new Date(date).toLocaleTimeString('es-US', { hour: '2-digit', minute: '2-digit' })
		console.log(hour)
		return hour
	}

	return (
		<div className='w-full'>
			{pacients.map(pacient => {
				return (
					<CardDate key={pacient.id_cita} nombre_paciente={pacient.nombre_paciente} ocupation={pacient.profesion} date={getHourFromDate(pacient.fecha_cita)} id_cita={pacient.id_cita} />
				)
			})}
		</div>
	)
}
