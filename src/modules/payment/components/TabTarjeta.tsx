import React, { useEffect } from 'react'
import Image from 'next/image'

import { createCoDiQR, CoDiData } from '../utils/generateCoDi'
import { useWallet } from '../../auth/context/WalletContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TabTarjeta(params: any) {

	const [qrCode, setQrCode] = React.useState<string>('')
	const { dentist } = useWallet()

	useEffect(() => {
		const data: CoDiData = {
			version: '1.0',
			merchantName: dentist?.nombre || '',
			merchantAccount: dentist?.numero_tarjeta || '',
			merchantBank: 'Nu',
			reference: '12548',
			amount: parseFloat(params.abonado),
			currency: 'MXN',
			countryCode: 'MX',
		}
		console.log('Data:', data)
		createCoDiQR(data).then((qrCode) => {
			console.log('QR Code generado:', qrCode)
			setQrCode(qrCode as string)
		})
	}, [dentist, params.abonado])

	return (
		<div className='flex flex-col items-center justify-center'>
			<Image src={qrCode} alt='Image QR' width={200} height={200} />
		</div>
	)
}

export default TabTarjeta