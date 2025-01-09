/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react';
import { useWallet } from '@/src/modules/auth/context/WalletContext';
import Dates from '../src/modules/home/Dates';
import Avatar from '../src/utils/Avatar';

export default function Home() {
	const { dentist } = useWallet();
	const [patientCount, setPatientCount] = useState<number | null>(null);

	// Obtener el conteo de pacientes
	useEffect(() => {
		const fetchPatientCount = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/countPatients/${dentist?.id_dentista}`);
				const data = await response.json();
				setPatientCount(data.count[0].totalPatients);
			} catch (error) {
				console.error('Error al obtener el conteo de pacientes:', error);
			}
		};

		if (dentist?.id_dentista) {
			fetchPatientCount();
		}
	}, [dentist?.id_dentista]);

	return (
		<div className="flex-1 w-full">
			{/* Imagen principal */}
			<div className="relative">
				<img src="/img/home_logo.png" className="absolute top-5 left-5" alt="Home Logo" />
				<img src="/img/home_image.png" className="w-full h-72 object-cover" alt="Dentist Home" />
			</div>

			{/* Información principal */}
			<div className="p-4 mt-7">
				<h1 className="text-2xl font-bold text-primary-color mb-4">¡Bienvenido, {dentist?.nombre}!</h1>

				{/* Sección de pacientes */}
				<div className="flex flex-col space-y-4">
					<h2 className="font-bold text-xl text-[#565656]">Tus Pacientes</h2>
					<div className="flex justify-around items-center h-20 rounded-xl bg-primary-color shadow-lg">
						<Avatar image="/icons/pacient.svg" />
						<div className="text-white text-center">
							<span className="font-bold text-4xl">{patientCount !== null ? `${patientCount}` : 'Cargando...'}</span>
						</div>
					</div>

					{/* Próximas citas */}
					<div className="mt-5">
						<h2 className="font-bold text-xl text-[#565656] mb-2">Próximas citas</h2>
						<Dates />
					</div>
				</div>
			</div>
		</div>
	);
}
