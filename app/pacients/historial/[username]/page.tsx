'use client';

import { Avatar } from '@mui/material'
import Link from 'next/link';
import { useEffect, useState } from 'react'

import { obtenerCitasPorPaciente } from '../../../../src/modules/contracts/contrato';
import { DataPacient, HistorialCita } from '@/src/utils/types';

export default function Historial({ params }: { params: DataPacient }) {
	const [historial, setHistorial] = useState<HistorialCita[]>([])
	const idPaciente = params.username.split("_")[1];
	const nombrePaciente = params.username.split("_")[0];

	useEffect(() => {
		console.log(parseInt(idPaciente))
		const fetchData = async () => {
			const response = await obtenerCitasPorPaciente(parseInt(idPaciente))
			console.log(response)
			setHistorial(response)
		}
		fetchData()
	}, [idPaciente]);

	function formatearFechaConHora(fechaString: string): string {
		// Convertir la fecha string a un objeto Date
		const fecha = new Date(fechaString);

		// Crear nombres de meses
		const meses = [
			"enero", "febrero", "marzo", "abril", "mayo", "junio",
			"julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
		];

		const dia = fecha.getDate(); // Día
		const mes = meses[fecha.getMonth()]; // Nombre del mes
		const anio = fecha.getFullYear(); // Año

		// Formato de hora (12 horas con AM/PM)
		let horas = fecha.getHours();
		const minutos = fecha.getMinutes().toString().padStart(2, "0"); // Asegurar 2 dígitos para los minutos
		const periodo = horas >= 12 ? "PM" : "AM"; // Determinar AM o PM
		horas = horas % 12 || 12; // Convertir a formato 12 horas, ajustando 0 -> 12

		// Formatear la fecha con la hora
		return `${dia} de ${mes} del ${anio} a las ${horas}:${minutos} ${periodo}`;
	}

	const fechaEjemplo = "1/7/2025, 3:00:00 PM";
	console.log(formatearFechaConHora(fechaEjemplo));
	// Resultado: "7 de enero del 2025 a las 3:00 PM"

	function formatearMotivo(motivo: string): string[] {
		'38 - caries - 500_SG - Tratamiento - 500'
		const datos = motivo.split("_");
		const procedimientos = datos.map((procedimiento) => procedimiento.replace("SG", "Servicio General"));
		return procedimientos
	}

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
				<h2 className="text-2xl mt-2">{nombrePaciente.replace('%20', ' ')}</h2>
			</div>

			<div className='my-8 mx-4 space-y-6'>
				{historial.length === 0 && <h2 className='text-center text-2xl'>No hay historial clinico</h2>}
				{historial?.map((cita, index) => {
					return (
						<div className='rounded-xl flex flex-col' key={index}>
							<span className='bg-acent-color text-white text-center rounded-t-xl'>{formatearFechaConHora(cita.fecha)}</span>
							<div className='flex flex-col justify-between mx-4 my-2'>
								<h2 className='text-xl'>{cita.nombreDentista}</h2>
								<span><strong>Telefono: </strong>{cita.telefonoDentista}</span>
							</div>
							<hr />
							<div className='mx-4 flex flex-col my-2'>
								<h3 className='text-gray-700'><strong>Paciente: </strong>{cita.nombrePaciente}</h3>
								<span className='text-sm text-gray-700'><strong>Profesion: </strong>{cita.profesionPaciente}</span>
								<span className='text-sm text-gray-700'><strong>Edad: </strong>{cita.edadPaciente}</span>
								<span className='text-sm text-gray-700'><strong>Alergias: </strong>{cita.alergias} <strong>Sangre: </strong>{cita.tipoSangre}</span>
							</div>
							<hr />
							<div className='text-xs mx-4 my-2 text-gray-400 flex flex-col'>
								<h2 className='uppercase font-bold text-gray-700 mb-1'>Procedimientos:</h2>
								{formatearMotivo(cita.motivo).map((procedimiento, index) => {
									return (
										<span key={index}>{procedimiento}</span>
									)
								}
								)}
							</div>
							<hr />
							<div className='text-xs mx-4 my-2 flex flex-col space-y-[3px]'>
								<h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>$ {cita.costoTotal}</span></h3>
								<h3 className='font-bold text-gray-700'>Fecha: <span className='font-normal text-gray-400'>{cita.fecha}</span></h3>
								<h3 className='font-bold text-gray-700'>Notas: <span className='font-normal text-gray-400'>
									{cita.observaciones}
								</span>
								</h3>
							</div>
							<div className='bg-primary-200 h-6 w-full flex flex-row-reverse rounded-b-xl p-1'></div>
						</div>
					)
				})}
			</div>

		</div>
	)
}
