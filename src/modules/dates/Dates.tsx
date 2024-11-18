/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useEffect, useState } from 'react';

import { DayPicker } from 'react-day-picker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import "react-day-picker/style.css";
import { TimeView } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

interface disabledHour {
	disabledHours: number;
}

export default function Dates(props: { setSection: (section: string) => void }) {

	const [days, setDays] = React.useState<Date | undefined>();
	const [valid, setValid] = useState(true);
	const [validDate, setValidDate] = useState(true);
	const [startTime, setStartTime] = useState<Dayjs | null>(null);
	const [endTime, setEndTime] = useState<Dayjs | null>(null);
	const [disabledHours, setDisabledHours] = useState<number[]>([]);

	const shouldDisableTime = (value: Dayjs, view: TimeView): boolean => {
		if (view === 'hours') {
			return disabledHours.includes(value.hour());
		}
		return false;
	};
	function formatDateForMySQL(date: Date) {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');  // +1 porque getMonth() devuelve 0 para enero
		const day = date.getDate().toString().padStart(2, '0');  // Asegura que el día tenga 2 dígitos
		return `${year}-${month}-${day}`;
	}

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		props.setSection("Service");
	}

	useEffect(() => {
		const getDisabledHours = async () => {
			const disabled = await fetch(`${process.env.NEXT_PUBLIC_API}/dates/getHoursDisable`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						date: formatDateForMySQL(days || new Date()),
					}),
				}
			);
			const { data } = await disabled.json();
			console.log(data[0])
			data[0].forEach((hour: disabledHour) => { disabledHours.push(hour.disabledHours) });
			console.log(disabledHours)
		}
		getDisabledHours();
	}, [days])

	useEffect(() => {
		if (days) {
			setValidDate(false)
		} else {
			setValidDate(true)
		}
		if (startTime && endTime) {
			if (startTime.isBefore(endTime)) {
				setValid(false)
				console.log(days, startTime?.hour() + '-' + startTime?.minute(), endTime?.hour() + '-' + endTime?.minute())
			} else {
				setValid(true)
			}
		}
	}, [days, startTime, endTime])

	return (
		<div className='flex flex-col w full'>
			<DayPicker
				mode="single"
				selected={days}
				onSelect={setDays}
				// disabled={day => {
				// 	const today = new Date();
				// 	today.setHours(0, 0, 0, 0);
				// 	return day < today; // Compara los días sin tener en cuenta la hora
				// }}
				defaultMonth={new Date()}
				classNames={{
					disabled: 'bg-gray-200',
					selected: 'bg-acent-color text-white rounded-lg',
					today: 'text-acent-color'
				}}
				className={"p-2 mx-auto"}
			/>

			<div className='mt-3 mx-5'>
				<h3 className='text-lg items-start text-[#595959] font-semibold'>Horarios disponibles</h3>
				<div className='flex items-center space-x-3 mt-2'>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<TimePicker label="Hora de inicio"
							timeSteps={{ hours: 1, minutes: 30 }}
							onChange={(date) => setStartTime(date)}
							shouldDisableTime={shouldDisableTime}
							disabled={validDate}
							reduceAnimations={true}
						/>
						<TimePicker label="Hora de fin"
							timeSteps={{ hours: 1, minutes: 30 }}
							onChange={(date) => setEndTime(date)}
							disabled={validDate}
							reduceAnimations={true}
						/>
					</LocalizationProvider>
				</div>
				<button onClick={(e) => handleSubmit(e)} disabled={valid} value={"CONTINUAR"} className="h-12 w-full mt-10 rounded-xl bg-primary-pressed text-white shadow-xl text-center disabled:border-0 disabled:bg-[#FFCD9F] disabled:text-white">
					CONTINUAR
				</button>
			</div>
		</div>
	)
}
