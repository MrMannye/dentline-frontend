'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

import { Avatar, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';

import {accountInputs} from '@/src/modules/dentist/utils/form-data'
import { useWallet } from '@/src/modules/auth/context/WalletContext';

function page(params: {username: string}) {
	
  const { register, getValues, formState: { errors, isValid }, handleSubmit } = useForm();
  const [saveData, setSaveData] = useState(true);
	const [dentalDisable, setDentalDisable] = useState(true);
	const [openModal, setOpenModal] = useState(false);
	const { account } = useWallet()

	const handleSaveData = (e: React.MouseEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { peso, estatura, sangre, pulso, presion, temperatura } = getValues();
		console.log(peso, pulso, temperatura, presion, estatura, sangre)
		setOpenModal(true);
	}
	console.log(dentalDisable, errors, handleSubmit)
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

  return (
    <div className='w-full flex-1'>
      <div className='bg-secundary-color h-20 mb-12 flex items-center px-4 space-x-4'>
				<Avatar className='mt-10' sx={{ width: 82, height: 82 }} src={"/img/home_image.png"} alt="User Image" />
				<article className='mt-2'>
					<h2 className='text-xl text-primary-color'>Nombre Dentista</h2>
					<h2 className='text-md text-primary-color'>Dentista</h2>
				</article>
			</div>

      <div className='px-4 flex flex-col items-start space-y-4'>
				{
					accountInputs.map((input) => {
						return (
							<FormControl key={input.name} sx={{ marginY: 0.8, marginX: 1 }} className='w-full' variant="standard">
								<InputLabel className='' htmlFor={`standard-adornment-${input.name}`}>{input.name}</InputLabel>
								<Input
									id={`standard-adornment-${input.name}`}
									type={'text'}
									disabled={input.visible}
									{...register(input.register, { required: input.required })}
									value={input.register === 'wallet' ? account : input.value}
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
					<input type="button" onClick={(e) => handleSaveData(e)} disabled={!saveData} value={"GUARDAR"} className="h-12 w-full rounded-xl text-secundary-normal bg-primary-pressed shadow-xl text-center disabled:bg-primary-disable" />
				</div>

			</div>

    </div>
  )
}

export default page