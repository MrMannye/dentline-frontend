import { useState } from 'react'
import { inputsService } from '../utils/InputsService'
import { Checkbox } from '@mui/material';

export default function TabService(props: { setSection: (section: string) => void }) {

	const [services, setServices] = useState<string[]>([])

	const saveServices = (service: string) => {
		if (services.includes(service)) {
			const newServices = services.filter((item) => item !== service);
			setServices(newServices);
		} else {
			setServices([...services, service]);
		}
	}

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		props.setSection("Summary");
	}

	return (
		<div className='flex flex-col w-full mt-5'>
			<div className=''>
				{inputsService.map((input) => {
					return (
						<div key={input.id} className={`p-3 flex items-center border justify-between border-gray-300 mx-4 mb-4 rounded-xl ${services.includes(input.name) && "bg-primary-100"}`}>
							<div className='flex items-center space-x-4'>
								<Checkbox onChange={() => saveServices(input.name)} className='h-8 w-8 text-gray-300 cursor-pointer' />
								<span className='text-[#595959] font-semibold text-base'>{input.name}</span>
							</div>
							<div className='flex items-center'>
								<span>$ <input defaultValue={`${input.price}`} type='number' onChange={(e) => input.price = e.target.value} className='text-[#595959] w-12 bg-transparent font-semibold text-base' /></span>
							</div>
						</div>
					)
				})}
			</div>
			<button onClick={(e) => handleSubmit(e)} disabled={!services.length} className="h-12 mx-4 mb-7 rounded-xl bg-primary-pressed text-white shadow-xl text-center disabled:border-0 disabled:bg-[#FFCD9F] disabled:text-white" >CONTINUAR</button>
		</div>
	)
}
