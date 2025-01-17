/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { FormControl, Input, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import ConsultDialog from '../../../utils/ConsultDialog';
import { usePatient } from '../../patients/context/PatientContext';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { min } from 'date-fns';

export default function Tratamiento() {
	const { patient, setPatient } = usePatient();
	const [openModal, setOpenModal] = useState(false);
	const [dentalDisable, setDentalDisable] = useState(true);
	const [saveData, setSaveData] = useState(true);
	const description = "Hacer cita ¿Estás seguro de que quieres agendar la cita?";
	const { register, getValues } = useForm();
	const router = useRouter();

	const saveDataConsult = () => {
		const allValues = getValues();
		const toothDataMap: Record<string, string[]> = {};

		// Agrupar dientes con el mismo tratamiento y precio
		(patient?.teeths || []).forEach((tooth) => {
			const tratamiento = allValues[`tratamiento${tooth}`] || "N/A";
			const precio = allValues[`precio${tooth}`] || "N/A";
			const key = `${tratamiento.trim().toLowerCase()} - ${precio.trim()}`;

			if (toothDataMap[key]) {
				toothDataMap[key].push(tooth);
			} else {
				toothDataMap[key] = [tooth];
			}
		});

		// Formatear resultados agrupados
		const formattedResults = Object.entries(toothDataMap).map(([key, teeth]) => {
			return `${teeth.join(", ")} - ${key}`;
		});

		setPatient({ ...patient, tratamiento: formattedResults });
		router.push(`/date`);
	}


	return (
		<div className='flex-1 w-full p-4'>
			{openModal && <ConsultDialog setDentalDisable={setDentalDisable} setSaveData={setSaveData} description={description} title={"Hacer cita"} />}
			<h1 className='text-acent-color tracking-wide font-semibold text-lg'>Piezas dentales y tratamientos</h1>
			<div className='space-y-3 mt-1 mb-6'>
				{(patient?.teeths || []).map((tooth) => {
					return (
						<div key={tooth} className="flex items-center p-4 bg-gradient-to-r rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
							<h3 className="text-xl font-semibold text-white bg-primary-500 py-12 px-4 mr-3 rounded-l-lg shadow-md">
								{tooth}
							</h3>
							<FormControl size="small" fullWidth style={{ padding: 0, margin: 0 }}>
								<div className="flex flex-col space-y-2 w-full">
									<TextField
										id="outlined-basic"
										label="Ingrese el tratamiento"
										variant="outlined"
										className="rounded-lg bg-white shadow-sm border-2 border-transparent focus:border-indigo-400 transition-all duration-300"
										{...register(`tratamiento${tooth}`, { required: true })}
									/>
									<Input
										id="standard-adornment-amount"
										type='number'
										placeholder='Precio'
										startAdornment={<InputAdornment position="start">$</InputAdornment>}
										{...register(`precio${tooth}`, { required: true, min: 0 })}
									/>
								</div>
							</FormControl>
						</div>
					)
				})}

			</div>
			<input type="button" onClick={() => saveDataConsult()} value={"GUARDAR"} className="h-12 w-full mt-8 self-center rounded-xl text-secundary-normal bg-primary-pressed shadow-xl text-center disabled:bg-primary-disable" />
		</div>
	)
}