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

interface Paciente {
	id_paciente: number;
	nombre_paciente: string;
}

export default function Pacients() {
	const { dentist } = useWallet();
	const [pacientes, setPacientes] = useState<Paciente[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
	const [newPaciente, setNewPaciente] = useState({
		nombre: '',
		profesion: '',
		edad: '',
		estado_civil: '',
		fecha_nacimiento: '',
		direccion: '',
		telefono: '',
		email: '',
		id_dentista: dentist?.id_dentista,
	});
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedPaciente, setSelectedPaciente] = useState<{ id: number | null; nombre: string | null }>({
		id: null,
		nombre: null,
	});


	const fetchData = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/allPacients/${dentist?.id_dentista}`);
		const data = await response.json();
		setPacientes(data.data);
		setFilteredPacientes(data.data);
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchTerm(query);

		if (query.trim() === '') {
			setFilteredPacientes(pacientes);
		} else {
			const filtered = pacientes.filter(paciente =>
				paciente.nombre_paciente.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredPacientes(filtered);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewPaciente(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/addPaciente`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newPaciente),
		});
		console.log(response);
		if (response.ok) {
			await fetchData();
			setIsModalOpen(false); // Cerrar el modal
		}
	};

	const openDeleteModal = (id_paciente: number, nombre_paciente: string) => {
		setSelectedPaciente({ id: id_paciente, nombre: nombre_paciente });
		setDeleteModalOpen(true);
	};

	const handleDelete = async () => {
		if (selectedPaciente === null) return;

		const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/deletePaciente/${selectedPaciente.id}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			await fetchData(); // Recargar la lista de pacientes
		} else {
			console.error('Error al eliminar el paciente');
		}

		setDeleteModalOpen(false);
		setSelectedPaciente({ id: null, nombre: null });
	};

	return (
		<div className='px-4 space-y-4 w-full flex-1 relative'>
			{/* Campo de búsqueda */}
			<div className="relative flex items-center border-2 border-gray-300 rounded-lg mt-3">
				<input
					type="text"
					value={searchTerm}
					onChange={handleSearch}
					placeholder="Buscar paciente..."
					className="w-full px-4 py-3 pl-10 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
				/>
				<SearchIcon className="text-gray-400 w-5 h-5 absolute right-3" />
			</div>

			{/* Muestra los pacientes filtrados */}
			{filteredPacientes.map((paciente) => (
				<div key={paciente.id_paciente} className="flex items-center justify-between space-x-4">
					<Link href={`/pacients/${paciente.nombre_paciente}_${paciente.id_paciente}`} className="flex items-center space-x-4">
						<Avatar image={"/img/home_image.png"} />
						<span className='text-base'>{paciente.nombre_paciente}</span>
					</Link>
					<MoreVertIcon
						onClick={() => openDeleteModal(paciente.id_paciente, paciente.nombre_paciente)}
						className="ml-auto"
					>
						<DeleteIcon />
					</MoreVertIcon>
				</div>
			))}

			{/* Botón flotante */}
			<div className='fixed right-[calc(50%-180px)] bottom-20'>
				<Fab aria-label="add" size='large' color='primary' onClick={() => setIsModalOpen(true)}>
					<PersonAddIcon className='text-white' />
				</Fab>
			</div>

			{/* Modal para añadir nuevo paciente */}
			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Box className="bg-white p-6 rounded-lg shadow-lg mx-auto my-10 max-w-md">
					<h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Añadir Nuevo Paciente</h2>
					<form className="space-y-4">
						{/* Nombre */}
						<TextField
							label="Nombre"
							name="nombre"
							fullWidth
							onChange={handleInputChange}
							variant="outlined"
							className="focus:ring-blue-500 focus:outline-none"
						/>

						{/* Profesión */}
						<TextField
							label="Profesión"
							name="profesion"
							fullWidth
							onChange={handleInputChange}
							variant="outlined"
							className="focus:ring-blue-500 focus:outline-none"
						/>

						{/* Edad */}
						<TextField
							label="Edad"
							name="edad"
							type="number"
							fullWidth
							onChange={handleInputChange}
							variant="outlined"
							className="focus:ring-blue-500 focus:outline-none"
						/>

						{/* Estado Civil */}
						<TextField
							label="Estado Civil"
							name="estado_civil"
							fullWidth
							onChange={handleInputChange}
							variant="outlined"
							className="focus:ring-blue-500 focus:outline-none"
						/>

						{/* Fecha de Nacimiento */}
						<TextField
							label="Fecha de Nacimiento"
							name="fecha_nacimiento"
							type="date"
							fullWidth
							onChange={handleInputChange}
							variant="outlined"
							className="focus:ring-blue-500 focus:outline-none"
						/>

						{/* Dirección */}
						<TextField
							label="Dirección"
							name="direccion"
							fullWidth
							onChange={handleInputChange}
							variant="outlined"
							multiline
							rows={3}
							className="focus:ring-blue-500 focus:outline-none"
						/>

						{/* Teléfono */}
						<TextField
							label="Teléfono"
							name="telefono"
							fullWidth
							onChange={handleInputChange}
							variant="outlined"
							className="focus:ring-blue-500 focus:outline-none"
						/>

						{/* Email */}
						<TextField
							label="Email"
							name="email"
							fullWidth
							onChange={handleInputChange}
							variant="outlined"
							className="focus:ring-blue-500 focus:outline-none"
						/>
					</form>

					{/* Botones */}
					<div className="mt-6 flex justify-end space-x-4">
						<Button
							variant="outlined"
							className="hover:bg-gray-100 text-gray-700"
							onClick={() => setIsModalOpen(false)}
						>
							Cancelar
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={handleSubmit}
						>
							Guardar
						</Button>
					</div>
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
