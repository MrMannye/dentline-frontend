'use client'

import React from 'react'
import Link from 'next/link';

import Avatar from '../../src/utils/Avatar';
import { Fab } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { useEffect, useState } from 'react';
import { useWallet } from '@/src/modules/auth/context/WalletContext';
import SearchIcon from '@mui/icons-material/Search';

interface Paciente {
	id_paciente: number;
	nombre_paciente: string;
}

export default function Pacients() {
	const { dentist } = useWallet()
	const [pacientes, setPacientes] = useState<Paciente[]>([])
	const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dentist/allPacients/${dentist?.id_dentista}`)
			const data = await response.json()
			setPacientes(data.data);
			setFilteredPacientes(data.data);
		}
		fetchData()
	}, [dentist]);

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

	const listArray: Array<string> = [];
	const addtoArray = (letter: string): string => {
		if (!listArray.includes(letter)) {
			listArray.push(letter);
			return letter;
		} else {
			return "";
		}
	}

	return (
		<div className='px-4 space-y-4 w-full flex-1'>
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
      {filteredPacientes.map((paciente) => {
        return (
          <div key={paciente.id_paciente} className="flex items-center space-x-4">
            <span className='text-3xl font-normal text-acent-color w-5'>{addtoArray(paciente.nombre_paciente.charAt(0))}</span>
            <Link href={`/pacients/${paciente.nombre_paciente}_${paciente.id_paciente}`} className="flex items-center space-x-4">
              <Avatar image={"/img/home_image.png"} />
              <span className='text-base'>{paciente.nombre_paciente}</span>
            </Link>
          </div>
        )
      })}

      {/* Botón flotante */}
      <div className='fixed right-7 bottom-32'>
        <Fab aria-label="add" size='large' color='primary'>
          <PersonAddIcon className='text-white' />
        </Fab>
      </div>
    </div>
	)
}
