import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';

import { useEffect, useState } from 'react';
import { useWallet } from '@/src/modules/auth/context/WalletContext';

import { Modal, Box, Button } from '@mui/material';
import Link from 'next/link';

interface DatesRecap {
	id_cita: number,
	nombre_paciente: string,
	fecha_cita: string,
	costo_total: number,
	observaciones: string,
	hora_cita: string
}

export default function CardDate() {
	const [dataDates, setDataDates] = useState<DatesRecap[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedCita, setSelectedCita] = useState<{ id: number | null; nombre: string | null }>({
		id: null,
		nombre: null,
	});
	const [filteredPacientes, setFilteredPacientes] = useState<DatesRecap[]>([]);
	const router = useRouter();
	const { dentist } = useWallet();

	// Función para obtener las citas
	const fetchData = async () => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/allDatesRecap/${dentist?.id_dentista}`);
			const data = await response.json();
			setDataDates(data.data);
			setFilteredPacientes(data.data);
		} catch (error) {
			console.error('Error al obtener las citas:', error);
		}
	};

	useEffect(() => {
		if (dentist?.id_dentista) {
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dentist]);

	// Función de búsqueda de citas
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchTerm(query);

		if (query.trim() === '') {
			setFilteredPacientes(dataDates);
		} else {
			const filtered = dataDates.filter(date =>
				date.nombre_paciente.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredPacientes(filtered);
		}
	};

	// Función para eliminar cita
	const handleDelete = async (id_cita: string | undefined) => {
		const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta cita?');
		if (!confirmDelete) return;

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dates/deleteDate/${id_cita}`, {
				method: 'DELETE',
			});
			const data = await response.json();
			console.log(data);
			if (response.ok) {
				await fetchData(); // Actualiza la lista de citas
			} else {
				console.log(`Error al eliminar la cita: ${data}`);
			}
		} catch (error) {
			console.error('Error al eliminar la cita:', error);
		}
	};

	const openDeleteModal = (id_cita: number, nombre_paciente: string) => {
		setSelectedCita({ id: id_cita, nombre: nombre_paciente });
		setDeleteModalOpen(true);
	};

	return (
		<>
			<div className="relative flex items-center border-2 border-gray-300 rounded-lg">
				<input
					type="text"
					value={searchTerm}
					onChange={handleSearch}
					placeholder="Buscar cita..."
					className="w-full px-4 py-3 pl-10 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
				/>
				<SearchIcon className="text-gray-400 w-5 h-5 absolute right-3" />
			</div>
			{filteredPacientes.map((date) => {
				return (
					<div className='rounded-xl flex flex-col mb-4 shadow-md' key={date.id_cita}>
						<Link href={`pacients/payment/${date.nombre_paciente}_${date.id_cita}`} className='w-full flex flex-col'>
							<span className='bg-acent-color text-white text-center rounded-t-xl tracking-wide'>
								{date.nombre_paciente}
							</span>
							<div className='text-xs mx-4 my-2 flex flex-col space-y-[3px]'>
								<h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>${date.costo_total}</span></h3>
								<h3 className='font-bold text-gray-700'>Fecha: <span className='font-normal text-gray-400'>{date.fecha_cita.split("T", 1)}</span></h3>
								<h3 className='font-bold text-gray-700'>Hora: <span className='font-normal text-gray-400'>{date.hora_cita.split("", 5)}</span></h3>
								<h3 className='font-bold text-gray-700'>Observaciones: <span className='font-normal text-gray-400'>{date.observaciones}</span></h3>
							</div>
						</Link>
						<div className='bg-primary-200 w-full flex items-center justify-around rounded-b-xl p-1'>
							<CalendarMonthIcon
								className='text-primary-color mx-3 text-base cursor-pointer'
								onClick={() => router.push('/reschedule?id_cita=' + date.id_cita)}
							/>
							<DeleteIcon
								className='text-red-500 mx-3 text-base cursor-pointer hover:text-red-700'
								onClick={() => openDeleteModal(date.id_cita, date.nombre_paciente)}
							/>
						</div>
					</div>
				)
			})}
			{/* Modal para confirmar eliminación */}
			<Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
				<Box className="bg-white p-6 rounded-lg shadow-md mx-auto my-10 max-w-sm">
					<h2 className="text-lg font-semibold mb-4">Confirmar Eliminación</h2>
					<p className="text-gray-600 mb-6">
						¿Estás seguro de que deseas eliminar a <strong>{selectedCita.nombre}</strong>?
					</p>
					<div className="flex justify-end space-x-4">
						<Button variant="outlined" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
						<Button variant="contained" color="primary" onClick={() => handleDelete(selectedCita.id?.toString())}>Eliminar</Button>
					</div>
				</Box>
			</Modal>
		</>
	);
}
