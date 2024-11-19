import { useEffect, useState } from 'react'
import { InputService, inputsService } from '../utils/InputsService'
import { Fab, FormControl, Input, InputAdornment, TextField } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TabService(props: { setSection: (section: string) => void }) {

	const [services, setServices] = useState<InputService[]>(inputsService);

	const addNewService = () => {
		const newService = {
			id: services.length + 1,
			name: "Tratamiento",
			price: "",
		}
		setServices([...services, newService])
	}
	const deleteService = (id: number) => {
		const newServices = services.filter(service => service.id !== id)
		setServices(newServices)
	}
	const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
		const newServices = services.map(service => {
			if (service.id === id) {
				service.name = e.target.value
			}
			return service
		})
		setServices(newServices)
	}
	const handleOnChangePrice = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
		const newServices = services.map(service => {
			if (service.id === id) {
				service.price = e.target.value
			}
			return service
		})
		setServices(newServices)
	}

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    props.setSection('Summary');
    console.log('Selected Services:', services);
  };

	useEffect(() => {
		console.log(services)
	}, [services])

// 21,22 - Limpieza - 1300_Coronas - 1200_

	return (
		<div className='flex flex-col w-full mt-5'>
			<div className=''>
				{services.map((input) => {
					return (
						<div key={input.id} className={`p-3 flex items-center border relative justify-between border-gray-300 mx-5 mb-5 rounded-xl`}>
							<Fab color="primary" size='small' style={{ position: 'absolute', top: -8, right: -7, zIndex: 10 }} onClick={() => deleteService(input.id)}>
								<DeleteIcon />
							</Fab>
							<FormControl size="small" fullWidth style={{ padding: 0, margin: 0 }}>
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
										className='mx-2 flex-1'
										placeholder='Precio'
										type='number'
										value={input.price}
										onChange={(e) => handleOnChangePrice(e, input.id)}
										startAdornment={<InputAdornment position="start">$</InputAdornment>}
									/>
								</div>
							</FormControl>
						</div>
					)
				})}
			</div>
			<article className='w-full px-4 mb-7 flex flex-col items-end space-y-2'>
				<Fab color="primary" aria-label="add" style={{ marginRight: 12 }} onClick={addNewService}>
					<AddIcon />
				</Fab>
				<button onClick={(e) => handleSubmit(e)} disabled={!services.length} className="h-12 w-full rounded-xl bg-primary-pressed text-white shadow-xl text-center disabled:border-0 disabled:bg-[#FFCD9F] disabled:text-white" >CONTINUAR</button>
			</article>
		</div>
	)
}
