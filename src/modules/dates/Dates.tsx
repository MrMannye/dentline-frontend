import { useEffect, useState } from 'react';
import React from 'react';

import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";

export default function Dates(props: { setSection: (section: string) => void }) {

	const actuaLDate = new Date();
	const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
	const [month, setMonth] = useState(new Date());
	const [days, setDays] = React.useState<Date | undefined>();
	const [horarioI, setHorarioI] = useState("");
	const [valid, setValid] = useState(true);
	const disabledDays = [
		new Date(2024, 8, 1),
		new Date(2024, 8, 12),
		new Date(2024, 8, 20),
		new Date(2024, 8, 11),
		new Date(2024, 8, 15),
		new Date(2024, 8, 26),
		{ from: new Date(2023, 2, 18), to: new Date(2023, 2, 20) }
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
				disabled={disabledDays}
				defaultMonth={new Date()}
				classNames={{ disabled: 'bg-gray-200', selected: 'bg-acent-color text-white rounded-lg', today: 'text-acent-color' }}
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
					{horarios.map((horario) => {
						return (
							<span onClick={() => selectHorario(horario.horarioInicio)} className={`w-[121px] flex items-center justify-center cursor-pointer rounded-lg h-[42px] font-semibold text-[#7B8794] bg-[#E3E7EB] ${horario.horarioInicio === horarioI && "bg-acent-color text-[#FFFFFF]"}`} key={horario.id}>
								{horario.horarioInicio} - {horario.horarioFin}
							</span>
						)
					})}
				</div>
				<button onClick={(e) => handleSubmit(e)} disabled={valid} value={"CONTINUAR"} className="h-12 w-full mt-10 rounded-xl bg-primary-pressed text-white shadow-xl text-center disabled:border-0 disabled:bg-[#FFCD9F] disabled:text-white">
					CONTINUAR
				</button>
			</div>
		</div>
	)
}
