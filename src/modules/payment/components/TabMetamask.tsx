import { useEffect, useState } from "react"
import QRCode from 'qrcode'
import Image from 'next/image'

function TabMetamask() {

	const [qrCode, setQrCode] = useState<string>('')
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

export default TabMetamask