'use client'

import { useState, useEffect } from 'react';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from '@mui/material/Avatar';

import PaymentCard from '@/src/modules/payment/PaymentCard'
import { Input, InputAdornment, IconButton, FormControl, InputLabel } from '@mui/material';
import PaymentDialog from '@/src/modules/payment/PaymentDialog';
import { useForm } from 'react-hook-form';

interface DatePacient {
	motivo: string,
	costo_total: number,
	fecha_cita: string,
	abono: number,
	observaciones: string,
	nombre: string,
	telefono: string,
	email: string,
	id_paciente: number,
	profresion: string,
	edad: number,
	tipo_sangre: string,
	alergias: string,
}

export default function Payment({ params }: { params: { username: string } }) {
	const id_cita = params.username.split("_")[1];
	const [paciente, setPaciente] = useState<DatePacient>()
	const { register, getValues, reset, setValue } = useForm();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/getDateById/${id_cita}`)
			const data = await response.json()
			setPaciente(data.data[0])
			console.log(data.data[0])
		}
		fetchData()
		reset({ abono: 0 })
	}, [id_cita, reset]);

	console.log(new Date(paciente?.fecha_cita || new Date()))
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClickPagoTotal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		if (paciente) {
			setValue('abonado', (paciente.costo_total ?? 0) - (paciente.abono ?? 0));
		}
		setOpen(true);
	};

	return (
		<div className="flex-1 w-full">
			<div className='relative bg-primary-color flex flex-col items-center text-white py-8'>
				<Avatar alt="Image Avatar"
					src={"/img/home_image.png"}
					sx={{ width: 82, height: 82 }} />
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
			<PaymentCard
				motivo={paciente?.motivo ?? ''}
				costo_total={paciente?.costo_total ?? 0}
				fecha_cita={paciente?.fecha_cita ?? ''}
				abono={paciente?.abono ?? 0}
				observaciones={paciente?.observaciones ?? ''}
			/>
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
	)
}