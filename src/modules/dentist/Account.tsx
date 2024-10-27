'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

import { Avatar, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';

import { accountInputs } from '@/src/modules/dentist/utils/form-data'
import { useWallet } from '@/src/modules/auth/context/WalletContext';

function Account() {

	const { account, dentist } = useWallet()
	const { register, getValues, reset, formState: { isValid } } = useForm();

	const [saveData, setSaveData] = useState(true);
	const [dentalDisable, setDentalDisable] = useState(true);

	console.log(dentalDisable)
	useEffect(() => {
		if (isValid) {
			if (saveData) {
				setSaveData(false);
			}
		} else {
			setSaveData(true)
			setDentalDisable(true);
		}
	}, [isValid, saveData])
	useEffect(() => {
		console.log(dentist)
		reset({
			nombre: dentist?.nombre,
			correo: dentist?.email,
			telefono: dentist?.telefono,
			wallet: account,
			clabe: dentist?.cuenta_clabe,
			tarjeta: dentist?.numero_tarjeta
		})
	}, [dentist, reset, account])

	const handleSaveData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		const { correo, nombre, telefono, clabe, tarjeta, } = getValues();
		console.log(correo, nombre, telefono, clabe, tarjeta, dentist?.id_dentista)
		fetch(`${process.env.NEXT_PUBLIC_API}/dentist/updateDentist`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				idDentist: dentist?.id_dentista,
				nombre: nombre,
				especializacion: 'Dentista',
				email: correo,
				telefono: telefono,
				cuenta_clabe: clabe,
				numero_tarjeta: tarjeta,
				wallet_address: account
			})
		}).then(response => response.json())
			.then(data => {
				console.log(data)
			})
			.catch(error => console.log(error))
	}

	return (
		<div className='w-full flex-1'>
			<div className='bg-secundary-color h-20 mb-12 flex items-center px-4 space-x-4'>
				<Avatar className='mt-10' sx={{ width: 82, height: 82 }} src={"/img/home_image.png"} alt="User Image" />
				<article className='mt-2'>
					<FormControl sx={{ marginY: 0.8 }} className='w-full' variant="standard">
						<Input
							id={`standard-adornment-${'nombre'}`}
							type={'text'}
							placeholder='Nombre Dentista'
							{...register('nombre', { required: true })}
							// value={input.register === 'wallet' && account}
							className='opacity-40 focus-within:opacity-90 '
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="Editable Input"
									>
										<EditIcon />
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
					<h2 className='text-sm text-primary-color'>Dentista</h2>
				</article>
			</div>

			<div className='px-4 flex flex-col items-start space-y-4'>
				{
					accountInputs.map((input) => {
						return (
							<FormControl key={input.name} sx={{ marginY: 0.8, marginX: 1 }} className='w-full' variant="standard">
								<InputLabel shrink htmlFor={`standard-adornment-${input.name}`}>{input.name}</InputLabel>
								<Input
									id={`standard-adornment-${input.name}`}
									type={'text'}
									disabled={input.visible}
									{...register(input.register, { required: input.required })}
									// value={input.register === 'wallet' && account}
									className='opacity-40 focus-within:opacity-90'
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="Editable Input"
											>
												<EditIcon />
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
						)
					})
				}

				<div className='flex flex-col items-center w-full'>
					<button onClick={(e) => handleSaveData(e)} disabled={!saveData} value={"GUARDAR"} className="h-12 w-full rounded-xl text-secundary-normal bg-primary-pressed shadow-xl text-center disabled:bg-primary-disable" />
				</div>

			</div>

		</div>
	)
}

export default Account