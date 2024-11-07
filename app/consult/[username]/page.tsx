'use client'

import { useState, useEffect } from 'react'
import { Avatar, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import { useRouter } from 'next/navigation'

import { consultaInputs } from '../../../src/utils/consult/form-registro'
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import ConsultDialog from '../../../src/utils/ConsultDialog';

interface Paciente {
	id_paciente: number;
	nombre_paciente: string;
}

export default function Consult({ params }: { params: { username: string } }) {

	const router = useRouter();
	const { register, getValues, formState: { errors, isValid }, handleSubmit } = useForm();
	const description = "Guardar ¿Estás seguro de que quieres guardar la información?";
	const [saveData, setSaveData] = useState(true);
	const [dentalDisable, setDentalDisable] = useState(true);
	const [openModal, setOpenModal] = useState(false);  
	const [dataPacient, setDataPacient] = useState<Paciente>();
	const id_paciente = params.username.split("_")[1];

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/${id_paciente}`);
			const { data } = await response.json();
			const pacientData = data[0];
			setDataPacient(pacientData);
		}
		fetchData();
	}, []);

	const handleSaveData = (e: React.MouseEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { peso, alergias, sangre, pulso, presion, antecedentes_medicos } = getValues();
		console.log(peso, pulso, antecedentes_medicos, presion, alergias, sangre)
		setOpenModal(true);
		fetch(`${process.env.NEXT_PUBLIC_API}/pacients/updateVitalSigns`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				tipo_sangre: sangre,
				antecedentes_medicos: antecedentes_medicos,
				peso: peso,
				pulso: pulso,
				presion: presion,
				alergias: alergias,
				id_paciente: id_paciente
			})
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
			})
			.catch(error => console.log(error));
	}

	console.log(dentalDisable, errors, handleSubmit)
	useEffect(() => {
		if (isValid) {
			if (saveData) {
				setSaveData(false);
			}
		} else {
			setSaveData(true)
			setDentalDisable(true);
		}
	}, [isValid, saveData])

	return (
		<div className='w-full flex-1'>
			{openModal && <ConsultDialog setDentalDisable={setDentalDisable} setSaveData={setSaveData} description={description} title={"Guardar"} />}
			<div className='bg-secundary-color h-16 mb-12 flex items-center px-4 space-x-2'>
				<Avatar className='mt-10' sx={{ width: 82, height: 82 }} src={"/img/home_image.png"} alt="User Image" />
				<h2 className='text-xl text-primary-color'>{dataPacient?.nombre_paciente}</h2>
			</div>
			<div className='px-4 flex flex-col items-start'>
				<h3 className='text-xl font-bold text-acent-color'>Signos Vitales</h3>
				{
					consultaInputs.map((input) => {
						return (
							<FormControl key={input.name} sx={{ marginY: 0.8, marginX: 1 }} className='w-full' variant="standard">
								<InputLabel htmlFor={`standard-adornment-${input.name}`}>{input.name}</InputLabel>
								<Input
									id={`standard-adornment-${input.name}`}
									type={'text'}
									{...register(input.register, { required: input.required })}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="Editable Input"
											>
												<EditIcon />
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
						)
					})
				}

				<div className='flex flex-col items-center mt-2 space-y-5 w-full'>
					<input type="button" onClick={(e) => handleSaveData(e)} disabled={saveData} value={"GUARDAR"} className="h-12 w-full rounded-xl text-secundary-normal bg-primary-pressed shadow-xl text-center disabled:bg-primary-disable" />
					<input type='button' onClick={() => router.push("/consult/sheet")} value={"INGRESAR FICHA DENTAL"} className="h-12 w-full rounded-xl border border-1 border-primary-pressed bg-secundary-normal text-primary-pressed text-center disabled:border-0 disabled:bg-white disabled:text-primary-disable" />
				</div>

			</div>
		</div>
	)
}
