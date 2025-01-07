'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import { Avatar, FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { accountInputs } from '@/src/modules/dentist/utils/form-data';
import { useWallet } from '@/src/modules/auth/context/WalletContext';
import getTypeCard from '@/src/modules/dentist/utils/getTypeCard';

function Account() {
	const { account, dentist, setDentist } = useWallet();

	const {
		register,
		getValues,
		reset,
		watch,
		formState: { isValid, errors },
	} = useForm({ mode: 'onChange' });

	const [saveData, setSaveData] = useState(true);
	const [cardType, setCardType] = useState<{ isValid: boolean, cardType: string } | null>();

	// Watch all form fields for changes
	const watchAllFields = watch();

	// Update save button state whenever fields change
	useEffect(() => {
		const hasChanged = Object.values(watchAllFields).some((value) => value !== undefined && value !== '');
		console.log(hasChanged, isValid);
		setSaveData(!isValid && !hasChanged);
	}, [watchAllFields, isValid]);

	// Reset form with dentist data
	useEffect(() => {
		reset({
			nombre: dentist?.nombre || '',
			correo: dentist?.email || '',
			telefono: dentist?.telefono || '',
			wallet: account || '',
			clabe: dentist?.cuenta_clabe || '',
			tarjeta: dentist?.numero_tarjeta || '',
		});
	}, [dentist, reset, account]);

	// Detect card type when tarjeta changes
	useEffect(() => {
		const tarjeta = watch('tarjeta');
		if (tarjeta) {
			const type = getTypeCard(tarjeta);
			setCardType(type);
		} else {
			setCardType(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch('tarjeta')]);

	const handleSaveData = (e: React.MouseEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { correo, nombre, telefono, clabe, tarjeta } = getValues();

		fetch(`${process.env.NEXT_PUBLIC_API}/dentist/updateDentist`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				idDentist: dentist?.id_dentista,
				nombre: nombre,
				especializacion: 'Dentista',
				email: correo,
				telefono: telefono,
				cuenta_clabe: clabe,
				numero_tarjeta: tarjeta,
				wallet_address: account,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setDentist({
					id_dentista: dentist?.id_dentista || '',
					nombre,
					especializacion: 'Dentista',
					email: correo,
					telefono,
					cuenta_clabe: clabe,
					numero_tarjeta: tarjeta,
					wallet_address: account || '',
				});
				// Desactiva el botón después de guardar exitosamente

			})
			.catch((error) => console.log(error));
	};

	return (
		<div className='w-full flex-1'>
			<div className='bg-secundary-color h-20 mb-12 flex items-center px-4 space-x-4'>
				<Avatar className='mt-10' sx={{ width: 82, height: 82 }} src={'/img/home_image.png'} alt='User Image' />
				<article className='mt-2'>
					<FormControl sx={{ marginY: 0.8 }} className='w-full' variant='standard'>
						<Input
							id='standard-adornment-nombre'
							type='text'
							placeholder='Nombre Dentista'
							{...register('nombre', { required: 'El nombre es obligatorio.' })}
							className='opacity-40 focus-within:opacity-90'
							endAdornment={
								<InputAdornment position='end'>
									<EditIcon />
								</InputAdornment>
							}
						/>
						{errors.nombre && <span className='text-red-500'>{errors.root?.message}</span>}
					</FormControl>
					<h2 className='text-sm text-primary-color'>Dentista</h2>
				</article>
			</div>

			<div className='px-4 flex flex-col items-start space-y-4'>
				{accountInputs.map((input) => (
					<FormControl key={input.name} sx={{ marginY: 0.8, marginX: 1 }} className='w-full' variant='standard'>
						<InputLabel shrink htmlFor={`standard-adornment-${input.name}`}>
							{input.name}
						</InputLabel>
						<Input
							id={`standard-adornment-${input.name}`}
							type='text'
							disabled={input.visible}
							{...register(input.register, {
								required: input.required && `${input.name} es obligatorio.`,
								minLength: input.min && { value: input.min, message: `Mínimo ${input.min} caracteres.` },
								maxLength: input.max && { value: input.max, message: `Máximo ${input.max} caracteres.` },
							})}
							className='opacity-40 focus-within:opacity-90'
							endAdornment={
								<InputAdornment position='end'>
									{input.register === 'tarjeta' && cardType ? (
										<Image src={`/icons/${cardType.cardType.toLowerCase()}.svg`} width={48} height={48} alt={`${cardType} Logo`} />
									) : (
										<EditIcon />
									)}
								</InputAdornment>
							}
						/>
						{errors[input.register] && <span className='text-red-500'>{errors[input.register]?.root?.message?.toString()}</span>}
					</FormControl>
				))}

				<div className='flex flex-col items-center w-full'>
					<input
						type='button'
						onClick={(e) => handleSaveData(e)}
						disabled={saveData}
						value={'GUARDAR'}
						className='h-12 w-full rounded-xl text-secundary-normal bg-primary-pressed shadow-xl text-center disabled:bg-primary-disable'
					/>
				</div>
			</div>
		</div>
	);
}

export default Account;
