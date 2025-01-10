/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input, InputAdornment, IconButton, FormControl, InputLabel } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import { usePatient } from '@/src/modules/patients/context/PatientContext';

export default function Pacient({ params }: { params: { username: string } }) {
	const router = useRouter();
	const [hasVitalSigns, setHasVitalSigns] = useState(false);
	const [isChanged, setIsChanged] = useState(false);
	const { register, handleSubmit, reset, formState: { errors } } = useForm();
	const id_paciente = params.username.split("_")[1];
	const { patient, setPatient } = usePatient();

	// Obtener datos del paciente y verificar signos vitales
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/${id_paciente}`);
				const { data } = await response.json();
				const pacientData = data[0];
				setPatient({ id_paciente, ...pacientData });
				reset({
					direccion: pacientData.direccion,
					profesion: pacientData.profesion,
					edad: pacientData.edad,
					estado_civil: pacientData.estado_civil,
				});

				// Verificar si el paciente tiene signos vitales
				const vitalSignsResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/hasVitalSigns/${id_paciente}`);
				const vitalSignsData = await vitalSignsResponse.json();
				setHasVitalSigns(vitalSignsData.data); // true si tiene registros, false si no.
				console.log('Has vital signs:', vitalSignsData.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, [id_paciente, reset, setPatient]);

	// Enviar datos del formulario
	const onSubmit = async (data: any) => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/updatePacientProfile`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id_paciente, ...data }),
			});
			const result = await response.json();
			console.log('Profile updated:', result);
			setIsChanged(false);
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};

	const checkChanges = (data: any) => {
		setIsChanged(
			data.direccion !== patient?.direccion ||
			data.profesion !== patient?.profesion ||
			data.edad !== patient?.edad ||
			data.estado_civil !== patient?.estado_civil
		);
	};

	const handleNavigation = (path: string) => {
		router.push(path);
	};

	return (
		<div className='w-full flex flex-col flex-1'>
			<div className='flex items-center justify-around w-full bg-secundary-color text-white p-2'>
				<h3 className='text-center'>PERFIL</h3>
				<h3 className='text-center'>DATOS</h3>
				<h3
					className='text-center cursor-pointer'
					onClick={() => handleNavigation(`/pacients/historial/${patient?.nombre_paciente}_${id_paciente}`)}
				>
					HISTORIAL
				</h3>
			</div>

			<div className='relative bg-primary-color flex flex-col items-center text-white py-8'>
				<Avatar alt="Image Avatar" src={"/img/home_image.png"} sx={{ width: 82, height: 82 }} />
				<h2 className="text-2xl mt-2">{patient?.nombre_paciente}</h2>

				<div className='absolute -bottom-5 flex items-center justify-around text-white bg-primary-500 p-2 space-x-5'>
					<div className='flex items-center space-x-1'>
						<LocalPhoneIcon />
						<span>{patient?.telefono}</span>
					</div>
					<div className='flex items-center space-x-1'>
						<EmailIcon />
						<span>{patient?.email}</span>
					</div>
				</div>
			</div>

			<section className='mx-3 mt-8'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FormControl sx={{ m: 1 }} className='w-full' variant="standard">
						<InputLabel shrink htmlFor="direccion">Dirección</InputLabel>
						<Input
							id="direccion"
							type='text'
							{...register('direccion', { required: 'La dirección es obligatoria.' })}
							onBlur={(e) => checkChanges(e.target.form)}
							className='opacity-40 focus-within:opacity-90'
							endAdornment={
								<InputAdornment position="end">
									<IconButton aria-label="toggle edit">
										<EditIcon />
									</IconButton>
								</InputAdornment>
							}
						/>
						{errors.direccion && <span className="text-red-500 text-xs">{errors.direccion.message?.toString()}</span>}
					</FormControl>

					<FormControl sx={{ marginY: 0.8, marginX: 1 }} className='w-full' variant="standard">
						<InputLabel shrink htmlFor="profesion">Profesión</InputLabel>
						<Input
							id="profesion"
							type='text'
							{...register('profesion', { required: 'La profesión es obligatoria.' })}
							onBlur={(e) => checkChanges(e.target.form)}
							className='opacity-40 focus-within:opacity-90'
							endAdornment={
								<InputAdornment position="end">
									<IconButton aria-label="toggle edit">
										<EditIcon />
									</IconButton>
								</InputAdornment>
							}
						/>
						{errors.profesion && <span className="text-red-500 text-xs">{errors.profesion.message?.toString()}</span>}
					</FormControl>

					<FormControl sx={{ marginY: 0.8, marginX: 1 }} className='w-full' variant="standard">
						<InputLabel shrink htmlFor={`edad`}>Edad</InputLabel>
						<Input
							id={`edad`}
							type='number'
							{...register('edad', { required: 'La edad es obligatoria.' })}
							onBlur={(e) => checkChanges(e.target.form)}
							className='opacity-40 focus-within:opacity-90'
							endAdornment={
								<InputAdornment position="end">
									<IconButton aria-label="toggle edit">
										<EditIcon />
									</IconButton>
								</InputAdornment>
							}
						/>
						{errors.edad && <span className="text-red-500 text-xs">{errors.edad.message?.toString()}</span>}
					</FormControl>

					<FormControl sx={{ m: 1 }} className='w-full' variant="standard">
						<InputLabel shrink htmlFor="estado_civil">Estado Civil</InputLabel>
						<Input
							id="estado_civil"
							type='text'
							{...register('estado_civil', { required: 'El estado civil es obligatorio.' })}
							onBlur={(e) => checkChanges(e.target.form)}
							className='opacity-40 focus-within:opacity-90'
							endAdornment={
								<InputAdornment position="end">
									<IconButton aria-label="toggle edit">
										<EditIcon />
									</IconButton>
								</InputAdornment>
							}
						/>
						{errors.estado_civil && <span className="text-red-500 text-xs">{errors.estado_civil.message?.toString()}</span>}
					</FormControl>

					<div className="flex flex-col items-center mt-4">
						<button
							type="submit"
							className={`h-12 w-44 rounded-xl border border-primary-pressed bg-secundary-normal flex items-center justify-center mb-2 disabled:opacity-35 text-primary-pressed`}
							disabled={!isChanged}
						>
							GUARDAR DATOS
						</button>
					</div>
				</form>
			</section>

			<div className="flex flex-col items-center mt-4">
				<span className="h-12 w-44 text-primary-pressed flex items-center justify-center">Continuar con:</span>
				<div className="flex space-x-4">
					<button
						className="h-12 w-44 rounded-xl border border-primary-pressed bg-secundary-normal text-primary-pressed flex items-center justify-center disabled:opacity-50"
						disabled={!hasVitalSigns}
						onClick={() => handleNavigation("/date")}
					>
						CITA
					</button>
					<button
						className="h-12 w-44 rounded-xl text-secundary-normal bg-primary-pressed shadow-xl flex items-center justify-center disabled:opacity-50"
						onClick={() => handleNavigation(`/consult/${patient?.nombre_paciente}`)}
					>
						CONSULTA
					</button>
				</div>
			</div>
		</div>
	);
}
