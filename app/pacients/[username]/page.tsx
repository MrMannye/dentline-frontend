'use client'

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Input, InputAdornment, IconButton, FormControl, InputLabel } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';

interface Pacient {
	id_paciente: number;
	nombre_paciente: string;
	profesion: string;
	edad: number;
	fecha_nacimiento: Date;
	direccion: string;
	telefono: string;
	email: string;
	estado_civil: string;
}

export default function Pacient() {
	const [isChanged, setIsChanged] = useState(false);
	const { register, getValues, reset } = useForm();
	const id_paciente = 21;
	const [pacient, setPacient] = useState<Pacient>();
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/${id_paciente}`);
			const { data } = await response.json();
			const pacientData = data[0];
			console.log(pacientData);
			setPacient(pacientData);
			reset({ direccion: pacientData.direccion, profesion: pacientData.profesion, edad: pacientData.edad, estado_civil: pacientData.estado_civil });
		}
		fetchData();
	}, []);

	const handleSaveData = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const { direccion, profesion, edad, estado_civil } = getValues();
		console.log(direccion, profesion, edad, estado_civil, id_paciente);
		fetch(`${process.env.NEXT_PUBLIC_API}/pacients/updatePacientProfile`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id_paciente: id_paciente,
				direccion: direccion,
				profesion: profesion,
				edad: edad,
				estado_civil: estado_civil,
			})
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
			})
			.catch(error => console.log(error));
	};

	const checkChanges = () => {
		const { direccion, profesion, edad, estado_civil } = getValues();
		console.log(direccion, profesion, edad, estado_civil);
		if (direccion !== pacient?.direccion) {
			setIsChanged(true);
		} else if (profesion !== pacient?.profesion) {
			setIsChanged(true);
		} else if (edad !== pacient?.edad) {
			setIsChanged(true);
		} else if (estado_civil !== pacient?.estado_civil) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}

	return (
		<div className='w-full flex flex-col flex-1'>
			<div className='flex items-center justify-around w-full bg-secundary-color text-white p-2'>
				<h3 className='text-center'>PERFIL</h3>
				<h3 className='text-center'>DATOS</h3>
				<Link className='' href={`/pacients/historial/${pacient?.nombre_paciente}`}>
					<h3 className='text-center'>HISTORIAL</h3>
				</Link>
			</div>

			<div className='relative bg-primary-color flex flex-col items-center text-white py-8'>
				<Avatar alt="Image Avatar" src={"/img/home_image.png"} sx={{ width: 82, height: 82 }} />
				<h2 className="text-2xl mt-2">{pacient?.nombre_paciente}</h2>

				<div className='absolute -bottom-5 flex items-center justify-around text-white bg-primary-500 p-2 space-x-5'>
					<div className='flex items-center space-x-1'>
						<LocalPhoneIcon />
						<span>{pacient?.telefono}</span>
					</div>
					<div className='flex items-center space-x-1'>
						<EmailIcon />
						<span>{pacient?.email}</span>
					</div>
				</div>
			</div>
			<section className='mx-3 mt-8'>
				<FormControl sx={{ m: 1 }} className='w-full' variant="standard">
					<InputLabel shrink htmlFor="direccion">Direccion</InputLabel>
					<Input id="direccion"
						type='text'
						{...register('direccion', { required: true })}
						onKeyUpCapture={() => checkChanges()}
						className='opacity-40 focus-within:opacity-90'
						endAdornment={
							<InputAdornment position="end">
								<IconButton aria-label="toggle password visibility">
									<EditIcon />
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>

				<FormControl sx={{ marginY: 0.8, marginX: 1 }} className='w-full' variant="standard">
					<InputLabel shrink htmlFor="profesion">Profesion</InputLabel>
					<Input
						id="profesion"
						type='text'
						{...register('profesion', { required: true })}
						onKeyUpCapture={() => checkChanges()}
						className='opacity-40 focus-within:opacity-90'
						endAdornment={
							<InputAdornment position="end">
								<IconButton aria-label="toggle password visibility">
									<EditIcon />
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>

				<FormControl sx={{ marginY: 0.8, marginX: 1 }} className='w-full' variant="standard">
					<InputLabel shrink htmlFor={`standard-adornment-edad`}>Edad</InputLabel>
					<Input
						id={`standard-adornment-edad`}
						type='number'
						{...register('edad', { required: true })}
						onKeyUpCapture={() => checkChanges()}
						className='opacity-40 focus-within:opacity-90'
						endAdornment={
							<InputAdornment position="end">
								<IconButton aria-label="toggle password visibility">
									<EditIcon />
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>

				<FormControl sx={{ m: 1 }} className='w-full' variant="standard">
					<InputLabel shrink htmlFor="estado_civil">Estado Civil</InputLabel>
					<Input
						id="estado_civil"
						type='text'
						{...register('estado_civil', { required: true })}
						onKeyUpCapture={() => checkChanges()}
						className='opacity-40 focus-within:opacity-90'
						endAdornment={
							<InputAdornment position="end">
								<IconButton aria-label="toggle password visibility">
									<EditIcon />
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
			</section>
			<div className="flex flex-col items-center mt-4">
				<button
					className={`h-12 w-44 rounded-xl border border-1 border-primary-pressed bg-secundary-normal flex items-center justify-center mb-2 disabled:opacity-35 text-primary-pressed`}
					disabled={!isChanged}
					onClick={(e) => handleSaveData(e)}
				>
					GUARDAR DATOS
				</button>
				<span className="h-12 w-44 text-primary-pressed flex items-center justify-center">Continuar con:</span>
				<div className="flex space-x-4">
					<Link
						href={"/date"}
						className="h-12 w-44 rounded-xl border border-1 border-primary-pressed bg-secundary-normal text-primary-pressed flex items-center justify-center"
					>
						CITA
					</Link>
					<Link
						href={`/consult/${pacient?.nombre_paciente}_${id_paciente}`}
						className="h-12 w-44 rounded-xl text-secundary-normal bg-primary-pressed shadow-xl flex items-center justify-center"
					>
						CONSULTA
					</Link>
				</div>
			</div>
		</div>
	)
}
