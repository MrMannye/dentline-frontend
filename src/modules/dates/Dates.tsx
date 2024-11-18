import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import React from 'react';

import { DayPicker } from 'react-day-picker';
import { Input } from '@mui/material'

export default function Dates(props: { setSection: (section: string) => void }) {

	const actuaLDate = new Date();
	const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	const [month, setMonth] = useState(new Date());
	const [days, setDays] = React.useState<Date | undefined>();
	const [horarioI, setHorarioI] = useState("");
	const [valid, setValid] = useState(true);
	const disabledDays = [
		{ before: new Date() }
	];
	const horarios = [
		{
			id: 1,
			horarioInicio: "11:00",
			horarioFin: "12:00"
		},
		{
			id: 2,
			horarioInicio: "13:00",
			horarioFin: "14:00"
		},
		{
			id: 3,
			horarioInicio: "14:00",
			horarioFin: "15:00"
		},
	]
	const selectHorario = (horaInicio: string) => {
		setHorarioI(horaInicio);
	}
	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		props.setSection("Service");
	}

	useEffect(() => {
		if (days && horarioI !== '') setValid(false);
		console.log(days)
	}, [days, horarioI])

	return (
		<div className='flex flex-col w full'>
			<DayPicker
				mode="single"
				selected={days}
				onSelect={setDays}
				disabled={day => {
					const today = new Date();
					today.setHours(0, 0, 0, 0); 
					return day < today; // Compara los días sin tener en cuenta la hora
			}}
				defaultMonth={new Date()}
				classNames={{
						disabled: 'bg-gray-200',
						selected: 'bg-acent-color text-white rounded-lg',
						today: 'text-acent-color'
				}}
				className={"p-2 mx-auto"}
			/>

			<div className='flex items-center mx-5 justify-between text-sm tracking-wider font-bold text-[#595959]'>
				<span onClick={() => setMonth(new Date(2023, new Date().getMonth()))}>{months[actuaLDate.getMonth()]}</span>
				<span onClick={() => setMonth(new Date(2023, new Date().getMonth() + 1))}>{months[actuaLDate.getMonth() + 1]}</span>
				<span onClick={() => setMonth(new Date(2023, new Date().getMonth() + 2))}>{months[actuaLDate.getMonth() + 2]
				}</span>
			</div>
			<div className='mt-3 mx-5'>
				<h3 className='text-lg items-start text-[#595959] font-semibold'>Horarios disponibles</h3>
				<div className='flex items-center space-x-3 mt-2'>
				<form noValidate>
						<Input
						id="time"
						type="time"
						defaultValue="07:30"
						inputProps={{
							step: 1800, // 5 minutos
						}}
					/>
				</form>
					<form noValidate>
						<TextField
							id="time"
							label="Hora de fin"
							type="time"
							defaultValue="07:30"
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								step: 1800, // 30 min
							}}
						/>
					</form>
				</div>
				<button onClick={(e) => handleSubmit(e)} disabled={valid} value={"CONTINUAR"} className="h-12 w-full mt-10 rounded-xl bg-primary-pressed text-white shadow-xl text-center disabled:border-0 disabled:bg-[#FFCD9F] disabled:text-white">
					CONTINUAR
				</button>
			</div>
		</div>
	)
}
