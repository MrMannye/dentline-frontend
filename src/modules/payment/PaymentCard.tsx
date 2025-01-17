import { useState } from "react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface DatePacientRecap {
	id_cita: number;
	motivo: string;
	costo_total: number;
	fecha_cita: string;
	abono: number;
	observaciones: string;
}

function CardPayment({ motivo, costo_total, fecha_cita, abono, observaciones, id_cita }: DatePacientRecap) {

	const [procedimientos, setProcedimientos] = useState<string[]>(motivo.split("_"));

	const handleRemoveProcedure = async (procedureToRemove: string) => {
		// Filter out the procedure to remove
		const updatedProcedures = procedimientos.filter((proc) => proc !== procedureToRemove);
		setProcedimientos(updatedProcedures);

		// Prepare the updated motive string
		const newMotivo = updatedProcedures.join("_");

		// Send the update to the backend
		try {
			const response = await fetch('/updateMotivo', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id_cita,
					motivo: newMotivo,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update motivo');
			}

			console.log('Motivo updated successfully');
		} catch (error) {
			console.error('Error updating motivo:', error);
		}
	};

	return (
		<div className='rounded-xl flex flex-col m-4 mt-8 border'>
			<span className='bg-acent-color text-white text-center rounded-t-xl'>{new Date(fecha_cita).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} {new Date(fecha_cita).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
			<div className='text-xs mx-4 my-2 text-gray-400 flex flex-col'>
				<h2 className='uppercase font-bold text-gray-700 mb-1'>Procedimientos:</h2>
				{motivo?.split("_").map((procedimiento, index) => {
					const [service, name, cost] = procedimiento.split("-");
					return (
						<div key={index} className='flex flex-row items-center mb-1 space-x-2'>
							<RemoveCircleOutlineIcon onClick={() => handleRemoveProcedure(procedimiento)} className='text-xs text-red-500 cursor-pointer'>Eliminar</RemoveCircleOutlineIcon>
							<span>{service} - {name} - ${cost}</span>;
						</div>
					)
				})}
			</div>
			<hr />
			<div className='text-xs mx-4 my-2 flex flex-col space-y-[3px] p-2'>
				<h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>${costo_total}</span></h3>
				<h3 className='font-bold text-gray-700'>Abonado: <span className='font-normal text-gray-400'>${abono}</span></h3>
				<h3 className='font-bold text-gray-700'>Notas: <span className='font-normal text-gray-400'>{observaciones}</span></h3>
			</div>
		</div>
	);
}

export default CardPayment;