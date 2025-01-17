'use client'

import { useState, useEffect } from 'react';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from '@mui/material/Avatar';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Input, InputAdornment, IconButton, FormControl, InputLabel } from '@mui/material';
import PaymentDialog from '@/src/modules/payment/PaymentDialog';
import { useForm } from 'react-hook-form';

interface DatePacient {
	motivo: string;
	costo_total: number;
	fecha_cita: string;
	abono: number;
	observaciones: string;
	nombre: string;
	telefono: string;
	email: string;
	id_paciente: number;
	profresion: string;
	edad: number;
	peso: string;
	pulso: string;
	presion: string;
	antecedentes_medicos: string;
	tipo_sangre: string;
	alergias: string;
}

export default function Payment({ params }: { params: { username: string } }) {
	const id_cita = params.username.split("_")[1];
	const [paciente, setPaciente] = useState<DatePacient>();
	const [procedimientos, setProcedimientos] = useState<string[]>([]);
	const { register, getValues, reset, setValue } = useForm();
	const [open, setOpen] = useState(false);

	const fetchPacienteData = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/getDateById/${id_cita}`);
		const data = await response.json();
		setPaciente(data.data[0]);
		setProcedimientos(data.data[0].motivo.split("_"));
	};

	useEffect(() => {
		fetchPacienteData();
		reset({ abono: 0 });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id_cita, reset]);

	const handleRemoveProcedure = async (procedureToRemove: string) => {
		const updatedProcedures = procedimientos.filter((proc) => proc !== procedureToRemove);
		const newMotivo = updatedProcedures.join("_");
		const newCostoTotal = updatedProcedures.reduce((total, proc) => {
			const [, , cost] = proc.split("-");
			return total + parseFloat(cost);
		}, 0);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dates/updateMotivo`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id_cita,
					motivo: newMotivo,
					costo_total: newCostoTotal,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update motivo and costo_total');
			}

			console.log('Motivo and costo_total updated successfully');
			// Update local state
			setPaciente((prev) => prev ? { ...prev, motivo: newMotivo, costo_total: newCostoTotal } : prev);
			fetchPacienteData();
		} catch (error) {
			console.error('Error updating motivo and costo_total:', error);
		}
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClickPagoTotal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		if (paciente) {
			setValue('abonado', (paciente.costo_total ?? 0) - (paciente.abono ?? 0));
		}
		setOpen(true);
	};

	return (
		<div className="flex-1 w-full">
			<div className='relative bg-primary-color flex flex-col items-center text-white py-8'>
				<Avatar alt="Image Avatar" src={"/img/home_image.png"} sx={{ width: 82, height: 82 }} />
				<h2 className="text-2xl mt-2">{paciente?.nombre}</h2>

				<div className='absolute -bottom-5 flex items-center justify-around text-white bg-primary-500 p-2 space-x-5'>
					<div className='flex items-center space-x-1'>
						<LocalPhoneIcon />
						<span>{paciente?.telefono}</span>
					</div>
					<div className='flex items-center space-x-1'>
						<EmailIcon />
						<span className='truncate w-44'>{paciente?.email}</span>
					</div>
				</div>
			</div>
			<div className='rounded-xl flex flex-col m-4 mt-8 border'>
				<span className='bg-acent-color text-white text-center rounded-t-xl'>
					{new Date(paciente?.fecha_cita || '').toLocaleDateString('es-ES', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})} {new Date(paciente?.fecha_cita || '').toLocaleTimeString('es-ES', {
						hour: '2-digit',
						minute: '2-digit',
						hour12: true,
					})}
				</span>
				<div className='text-xs mx-4 my-2 text-gray-400 flex flex-col'>
					<h2 className='uppercase font-bold text-gray-700 mb-1'>Procedimientos:</h2>
					{procedimientos.map((procedimiento, index) => {
						const [service, name, cost] = procedimiento.split("-");
						return (
							<div key={index} className='flex flex-row items-center mb-1 space-x-2'>
								<RemoveCircleOutlineIcon
									onClick={() => handleRemoveProcedure(procedimiento)}
									className='text-xs text-red-500 cursor-pointer'
								/>
								<span>{service} - {name} - ${cost}</span>
							</div>
						);
					})}
				</div>
				<hr />
				<div className='text-xs mx-4 my-2 flex flex-col space-y-[3px] p-2'>
					<h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>${paciente?.costo_total}</span></h3>
					<h3 className='font-bold text-gray-700'>Abonado: <span className='font-normal text-gray-400'>${paciente?.abono}</span></h3>
					<h3 className='font-bold text-gray-700'>Notas: <span className='font-normal text-gray-400'>{paciente?.observaciones}</span></h3>
				</div>
			</div>
			<FormControl className='px-8 w-full' variant="standard">
				<InputLabel shrink className='mx-8' htmlFor="standard-adornment-password">Abonar</InputLabel>
				<Input
					id="standard-adornment-password"
					type={'number'}
					{...register('abonado', { required: true })}
					className='m-8'
					endAdornment={
						<InputAdornment position="end">
							<IconButton aria-label="toggle password visibility">
								<button onClick={handleClickOpen} className='text-xs text-acent-color p-2 rounded-md'>Abonar</button>
							</IconButton>
						</InputAdornment>
					}
				/>
			</FormControl>
			<div className='px-8 w-full'>
				<button className='input__button w-full' onClick={(e) => handleClickPagoTotal(e)}>
					Pago Total
				</button>
			</div>
			<PaymentDialog open={open} setOpen={setOpen} abonado={getValues().abonado} idCita={parseInt(id_cita)} {...paciente} />
		</div>
	);
}
