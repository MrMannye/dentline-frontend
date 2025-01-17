import { useState } from 'react';
import { InputService, inputsService } from '../utils/InputsService';
import { Fab, FormControl, Input, InputAdornment, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePatient } from '../../patients/context/PatientContext';
import { useForm } from 'react-hook-form';

export default function TabService(props: { setSection: (section: string) => void }) {
	const [services, setServices] = useState<InputService[]>(inputsService);
	const { patient, setPatient } = usePatient();
	const { register, getValues } = useForm();


	const addNewService = () => {
		const newService = {
			id: services.length + 1,
			name: "Tratamiento",
			price: "",
		};
		setServices([...services, newService]); // Solo se actualiza el estado
	};

	const deleteService = (id: number) => {
		const newFilterServices = services.filter(service => service.id !== id);
		setServices(newFilterServices);
	};

	const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
		const newServices = services.map(service =>
			service.id === id ? { ...service, name: e.target.value } : service
		);
		setServices(newServices);
	};

	const handleOnChangePrice = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
		const newServices = services.map(service =>
			service.id === id ? { ...service, price: e.target.value } : service
		);
		setServices(newServices);
	};

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const allValues = getValues();
		e.preventDefault();
		console.log(services);

		const newServices = patient?.tratamiento?.filter(service => {
			const nombreServicio = service.split('-')[0]?.trim();
			return nombreServicio !== "SG";
		});

		const nuevoTratamiento = services.map(service => `SG - ${service.name} - ${service.price}`);

		if (patient) {
			setPatient({
				...patient,
				tratamiento: [...(newServices || []), ...nuevoTratamiento],
				observaciones: allValues.observaciones,
			});
		}

		props.setSection("Summary");
	};

	return (
		<div className="flex flex-col w-full mt-5">
			<div>
				{services.map((input) => (
					<div key={input.id} className="p-3 flex items-center border relative justify-between border-gray-300 mx-5 mb-5 rounded-xl">
						<Fab
							color="primary"
							size="small"
							style={{ position: 'absolute', top: -8, right: -7, zIndex: 10 }}
							onClick={() => deleteService(input.id)}
						>
							<DeleteIcon />
						</Fab>
						<FormControl size="small" fullWidth>
							<div className="flex items-center space-y-2 w-full">
								<TextField
									id="outlined-basic"
									variant="outlined"
									label="Ingrese el tratamiento"
									className="rounded-lg bg-white shadow-sm border-2 border-transparent focus:border-indigo-400 transition-all duration-300"
									value={input.name}
									onChange={(e) => handleOnChangeName(e, input.id)}
								/>
								<Input
									id="standard-adornment-amount"
									className="mx-2 flex-1"
									placeholder="Precio"
									type="number"
									value={input.price}
									onChange={(e) => handleOnChangePrice(e, input.id)}
									startAdornment={<InputAdornment position="start">$</InputAdornment>}
								/>
							</div>
						</FormControl>
					</div>
				))}
			</div>
			<div className='p-5'>
				<TextField
					id="standard-multiline-static"
					multiline
					className='w-full mt-16 mx-4'
					rows={8}
					label="Ingrese observaciones"
					variant="outlined"
					{...register("observaciones", { required: true })}
				/>
			</div>
			<article className="w-full px-4 mb-7 flex flex-col items-end space-y-2">
				<Fab color="primary" aria-label="add" style={{ marginRight: 12 }} onClick={addNewService}>
					<AddIcon />
				</Fab>
				<button
					onClick={(e) => handleSubmit(e)}
					disabled={!services.length}
					className="h-12 w-full rounded-xl bg-primary-pressed text-white shadow-xl text-center disabled:border-0 disabled:bg-[#FFCD9F] disabled:text-white"
				>
					CONTINUAR
				</button>
			</article>
		</div>
	);
}
