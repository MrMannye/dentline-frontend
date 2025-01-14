'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Avatar from '../../src/utils/Avatar';
import { Fab, Modal, Box, TextField, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { useWallet } from '@/src/modules/auth/context/WalletContext';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useForm } from 'react-hook-form';

interface Paciente {
	id_paciente: number;
	nombre_paciente: string;
}

interface FormInputs {
	nombre: string;
	profesion: string;
	edad: number;
	estado_civil: string;
	fecha_nacimiento: string;
	direccion: string;
	telefono: string;
	email: string;
}

export default function Pacients() {
	const { dentist } = useWallet();
	const [pacientes, setPacientes] = useState<Paciente[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedPaciente, setSelectedPaciente] = useState<{ id: number | null; nombre: string | null }>({
		id: null,
		nombre: null,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm();

	const fetchData = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/allPacients/${dentist?.id_dentista}`);
		const data = await response.json();
		console.log(data.data);
		setPacientes(data.data);
		setFilteredPacientes(data.data);
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value.trim().toLowerCase();
		setSearchTerm(query);

		if (query === '') {
			setFilteredPacientes(pacientes);
		} else {
			const filtered = pacientes.filter(paciente =>
				paciente.nombre_paciente.toLowerCase().includes(query) ||
				paciente.id_paciente.toString().includes(query)
			);
			setFilteredPacientes(filtered);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onSubmit = async (data: any) => {
		const newPaciente = {
			...data,
			id_dentista: dentist?.id_dentista,
		};

		const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/addPaciente`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newPaciente),
		});

		if (response.ok) {
			await fetchData();
			setIsModalOpen(false);
			reset();
		}
	};

	const openDeleteModal = (id_paciente: number, nombre_paciente: string) => {
		setSelectedPaciente({ id: id_paciente, nombre: nombre_paciente });
		setDeleteModalOpen(true);
	};

	const handleDelete = async () => {
		if (!selectedPaciente.id) return;

		const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/deletePaciente/${selectedPaciente.id}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			await fetchData();
			setDeleteModalOpen(false);
			setSelectedPaciente({ id: null, nombre: null });
		} else {
			console.error('Error al eliminar el paciente');
		}
	};

	return (
		<div className='px-4 space-y-4 w-full flex-1 relative'>
			{/* Campo de búsqueda */}
			<div className="relative flex items-center border-2 border-gray-300 rounded-lg mt-3">
				<input
					type="text"
					value={searchTerm}
					onChange={handleSearch}
					placeholder="Buscar paciente por nombre o ID..."
					className="w-full px-4 py-3 pl-10 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
				/>
				<SearchIcon className="text-gray-400 w-5 h-5 absolute right-3" />
			</div>

			{/* Lista de pacientes */}
			{filteredPacientes.map((paciente) => (
				<div key={paciente.id_paciente} className="flex items-center justify-between space-x-4">
					<Link href={`/pacients/${paciente.nombre_paciente}_${paciente.id_paciente}`} className="flex items-center space-x-4">
						<Avatar image={"/img/home_image.png"} />
						<span className='text-base'>{`${paciente.nombre_paciente} - ${paciente.id_paciente}`}</span>
					</Link>
					<MoreVertIcon
						onClick={() => openDeleteModal(paciente.id_paciente, paciente.nombre_paciente)}
						className="ml-auto cursor-pointer"
					>
						<DeleteIcon />
					</MoreVertIcon>
				</div>
			))}

			{/* Botón flotante para añadir paciente */}
			<div className='fixed right-[calc(50%-180px)] bottom-20'>
				<Fab aria-label="add" size='large' color='primary' onClick={() => setIsModalOpen(true)}>
					<PersonAddIcon className='text-white' />
				</Fab>
			</div>

			{/* Modal para añadir nuevo paciente */}
			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} className="flex items-center justify-center max-w-md mx-auto">
				<Box className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Añadir Nuevo Paciente</h2>
					<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
						{[
							{ name: "nombre", label: "Nombre", pattern: /^[A-Za-z\s]+$/, errorMessage: "Solo se permiten letras." },
							{ name: "profesion", label: "Profesión", required: "Campo obligatorio" },
							{ name: "edad", label: "Edad", type: "number", min: 0, required: "Edad obligatoria" },
							{ name: "estado_civil", label: "Estado Civil", required: "Campo obligatorio" },
							{ name: "fecha_nacimiento", label: "Fecha de Nacimiento", type: "date", required: "Fecha obligatoria" },
							{
								name: "direccion",
								label: "Dirección",
								minLength: 10,
								required: "Dirección obligatoria",
								validate: {
									validStructure: (value: string) =>
										/^(?=.*(calle|avenida|av|número|numero|n°))(?=.*\d)/i.test(value.toLowerCase()) ||
										"La dirección debe contener al menos una referencia válida como 'calle', 'avenida' y un número.",
									noForbiddenWords: (value: string) =>
										!["ninguna", "na", "sin calle", "no aplica"].some((word) => value.toLowerCase().includes(word)) ||
										"No se permiten direcciones como 'Ninguna' o 'No aplica'.",
								},
							},
							{ name: "telefono", label: "Teléfono", pattern: /^[0-9]{10}$/, errorMessage: "Teléfono inválido, deben ser 10 dígitos" },
							{ name: "email", label: "Email", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMessage: "Formato de email incorrecto." }
						].map((field) => (
							<TextField
								key={field.name}
								fullWidth
								label={field.label}
								className='focus:ring-blue-500 focus:outline-none'
								variant="outlined"
								type={field.type || 'text'}
								{...register(field.name, {
									required: field.required,
									minLength: field.minLength && { value: field.minLength, message: `Mínimo ${field.minLength} caracteres.` },
									validate: field.validate || undefined,
									pattern: field.pattern || undefined,
								})}
								error={!!errors[field.name as keyof FormInputs]}
								helperText={errors[field.name as keyof FormInputs]?.message?.toString()}
							/>
						))}
						<div className="mt-6 flex justify-end space-x-4">
							<Button variant="outlined" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
							<Button variant="contained" color="primary" type="submit">Guardar</Button>
						</div>
					</form>
				</Box>
			</Modal>

			{/* Modal para confirmar eliminación */}
			<Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
				<Box className="bg-white p-6 rounded-lg shadow-md mx-auto my-10 max-w-sm">
					<h2 className="text-lg font-semibold mb-4">Confirmar Eliminación</h2>
					<p className="text-gray-600 mb-6">
						¿Estás seguro de que deseas eliminar a <strong>{selectedPaciente.nombre}</strong>?
					</p>
					<div className="flex justify-end space-x-4">
						<Button variant="outlined" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
						<Button variant="contained" color="primary" onClick={handleDelete}>Eliminar</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
}