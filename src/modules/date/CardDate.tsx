import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';

import { useEffect, useState } from 'react';
import { useWallet } from '@/src/modules/auth/context/WalletContext';

import Link from 'next/link'

interface DatesRecap{
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
  const [filteredPacientes, setFilteredPacientes] = useState<DatesRecap[]>([]);
	const router = useRouter();
	const { dentist } = useWallet()

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/allDatesRecap/${dentist?.id_dentista}`);
			const data = await response.json();
			setDataDates(data.data);
			setFilteredPacientes(data.data);
		}
		fetchData()
	}, [dentist]);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.trim() === '') {
      setFilteredPacientes(dataDates); 
    } else {
      const filtered = filteredPacientes.filter(date =>
        date.nombre_paciente.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPacientes(filtered);
    }
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
					<Link href={`pacients/payment/${date.nombre_paciente}_${date.id_cita}`} className='rounded-xl flex flex-col' key={date.id_cita}>
						<span className='bg-acent-color text-white text-center rounded-t-xl tracking-wide'>{date.nombre_paciente}</span>
						<div className='text-xs mx-4 my-2 flex flex-col space-y-[3px]'>
							<h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>${date.costo_total}</span></h3>
							<h3 className='font-bold text-gray-700'>Fecha: <span className='font-normal text-gray-400'>{date.fecha_cita.split("T",1)}</span></h3>
							<h3 className='font-bold text-gray-700'>Hora: <span className='font-normal text-gray-400'>{date.hora_cita.split("",5)}</span></h3>
							<h3 className='font-bold text-gray-700'>Observaciones: <span className='font-normal text-gray-400'>{date.observaciones}</span></h3>
						</div>
						<div className='bg-primary-200 w-full flex items-center justify-around rounded-b-xl p-1'>
							<CalendarMonthIcon className='text-primary-color mx-3 text-base' onClick = {() => router.push("/date")} />
								<DeleteIcon className='text-primary-color mx-3 text-base' />
							</div>
					</Link>
				)
			})}
		</>
	)
}
