import { useEffect, useState } from 'react'
import { Avatar } from '@mui/material'
import ConsultDialog from '../../../utils/ConsultDialog';
import { usePatient } from '../../patients/context/PatientContext';
import { useWallet } from '../../auth/context/WalletContext';

export default function TabSummary() {

	const [saveData, setSaveData] = useState(true);
	const [dentalDisable, setDentalDisable] = useState(true);
	const [openModal] = useState(false);
	const description = "Hacer cita ¿Estás seguro de que quieres agendar la cita?";
	const { patient } = usePatient();
	const [servicios] = useState(patient?.tratamiento || []);
	const {dentist} = useWallet();

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		setSaveData(true);
		console.log(patient?.id_paciente)
		fetch(`${process.env.NEXT_PUBLIC_API}/pacients/postRecapDate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id_paciente: patient?.id_paciente,
				id_dentista: dentist?.id_dentista,
				fecha_cita: `${patient?.fecha_cita} ${patient?.fecha_start_cita?.getHours().toString().padStart(2, '0')}:${patient?.fecha_start_cita?.getMinutes().toString().padStart(2, '0')}}`,
				motivo: patient?.tratamiento?.join("_"),
				costo_total: getTotalPrince(),
				observaciones: patient?.observaciones
			})
		}).then(response => response.json())
			.then(data => {
				console.log(data)
			})
			.catch(error => console.log(error))

	}

	const getTotalPrince = () => {
		let total = 0;
		servicios.forEach(service => {
			if (service !== '')
				total += parseFloat(service.split('-')[2]);
		})
		return total;
	}

	useEffect(() => {
		console.log(saveData, dentalDisable, patient)
	}, [saveData, dentalDisable, patient])

	return (
		<div className='w-full flex flex-col'>
			{openModal && <ConsultDialog setDentalDisable={setDentalDisable} setSaveData={setSaveData} description={description} title={"Hacer cita"} />}
			<div className='bg-primary-100 h-16 mb-12 flex items-center px-4 space-x-2'>
				<Avatar className='mt-10' sx={{ width: 82, height: 82 }} src={"/img/home_image.png"} alt="User Image" />
				<h2 className='text-2xl text-primary-800'>{patient?.nombre_paciente}</h2>
			</div>
			<div className='flex px-4 justify-between'>
				<div className='flex flex-col items-start'>
					<h3 className='text-acent-color text-xl font-bold mb-3'>Resumen</h3>
					<span className='text-xs text-gray-400 font-semibold'>FECHA</span>
					<h3 className='text-xl text-gray-600 font-bold'>{`${patient?.fecha_start_cita?.toLocaleDateString("es-ES", {
						weekday: "long", // Nombre del día (lunes, martes...)
						year: "numeric", // Año completo (2024)
						month: "long",   // Mes completo (noviembre)
						day: "numeric"   // Día del mes (20)
					})}`}</h3>
					<span className='text-xs mt-1 text-gray-400 font-semibold'>HORA</span>
					<h3 className='text-xl text-gray-600 font-bold'>
						{`${patient?.fecha_start_cita?.getHours().toString().padStart(2, '0')}:${patient?.fecha_start_cita?.getMinutes().toString().padStart(2, '0')} - ${patient?.fecha_end_cita?.getHours().toString().padStart(2, '0')}:${patient?.fecha_end_cita?.getMinutes().toString().padStart(2, '0')}`}
					</h3>
				</div>
				<div className='w-[179px] h-[60px] bg-primary-100 rounded-xl mt-2 flex flex-col items-center text-xs p-2 text-gray-400 font-extrabold'>
					<span className='tracking-wider'>COSTO FINAL</span>
					<span className='text-base font-bold'>${getTotalPrince()}</span>
				</div>
			</div>
			<div className='px-4 mt-9'>
				<span className='text-xs text-gray-400 tracking-wide'>SERVICIOS</span>
				{servicios.map((service, id) => {
					if (service === '') return null;
					return (
						<div key={id} className="w-[280px] bg-primary-100 tracking-wider p-2 rounded-lg mb-4 flex items-center justify-between text-base">
							<span>{service.split('-')[0]}</span>
							<span>{service.split('-')[1]}</span>
							<span>${service.split('-')[2]}</span>
						</div>
					)
				})}
				<span className="text-sm text-gray-700 italic font-medium bg-gray-100 p-2 rounded-lg block mt-4">
					Observaciones: {patient?.observaciones}
				</span>
			</div>
			<button onClick={(e) => handleSubmit(e)} className="h-12 mt-[53px] mx-4 rounded-xl bg-primary-pressed text-white shadow-xl text-center disabled:border-0 disabled:bg-[#FFCD9F] disabled:text-white" >AGENDAR</button>
		</div>
	)
}
