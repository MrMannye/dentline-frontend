import { useEffect, useState } from "react"
import QRCode from 'qrcode'
import Image from 'next/image'
import { useWallet } from "../../auth/context/WalletContext"

function TabMetamask() {

	const [qrCode, setQrCode] = useState<string>('')
	const { account } = useWallet()
	useEffect(() => {
		QRCode.toDataURL(account ?? '')
			.then(url => {
				setQrCode(url)
			})
			.catch(err => {
				console.error(err)
			})
	}, [account])

	return (
		<div className='flex flex-col items-center justify-center'>
			<Image src={qrCode} alt='Image QR' width={200} height={200} />
		</div>
	)
}

export default TabMetamask