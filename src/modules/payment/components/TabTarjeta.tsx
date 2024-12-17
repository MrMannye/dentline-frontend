import React, { useEffect } from 'react'
import QRCode from 'qrcode'
import Image from 'next/image'

import { createCoDiQR } from '../utils/generateCoDi'

function TabTarjeta() {

	const [qrCode, setQrCode] = React.useState<string>('')
	useEffect(() => {
		QRCode.toDataURL('https://www.google.com')
			.then(url => {
				setQrCode(url)
			})
			.catch(err => {
				console.error(err)
			})
	}, [])

	return (
		<div className='flex flex-col items-center justify-center'>
			<Image src={qrCode} alt='Image QR' width={200} height={200} />
		</div>
	)
}

export default TabTarjeta