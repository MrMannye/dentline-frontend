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
	const { register, getValues, formState: { errors, isValid }, handleSubmit } = useForm();
	const id_paciente = 21;
	const [pacient, setPacient] = useState<Pacient>();
	console.log(isValid, errors, handleSubmit)
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/${id_paciente}`);
			const { data } = await response.json();
			console.log(data[0]);
			setPacient(data[0]);
		}
		fetchData();
	}, [id_paciente]);

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
					<InputLabel htmlFor="direccion">Direccion</InputLabel>
					<Input id="direccion"
						type='text'
						defaultValue={pacient?.direccion}
						{...register('direccion', { required: true })}
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
					<InputLabel htmlFor="profesion">Profesion</InputLabel>
					<Input
						id="profesion"
						type='text'
						defaultValue={pacient?.profesion}
						{...register('profesion', { required: true })}
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
					<InputLabel htmlFor={`standard-adornment-edad`}>Edad</InputLabel>
					<Input
						id={`standard-adornment-edad`}
						type='number'
						defaultValue={pacient?.edad}
						{...register('edad', { required: true })}
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
					<InputLabel htmlFor="estado_civil">Estado Civil</InputLabel>
					<Input
						id="estado_civil"
						type='text'
						onKeyDown={() => setIsChanged(true)}
						defaultValue={pacient?.estado_civil}
						{...register('estado_civil', { required: true })}
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
						href={`/consult/${pacient?.nombre_paciente}`}
						className="h-12 w-44 rounded-xl text-secundary-normal bg-primary-pressed shadow-xl flex items-center justify-center"
					>
						CONSULTA
					</Link>
				</div>
			</div>
		</div>
	)
}
