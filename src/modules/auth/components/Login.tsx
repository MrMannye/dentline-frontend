'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useWallet } from '../context/WalletContext'
import { useEffect } from 'react'

export default function Login() {

	const router = useRouter()
	const { account, connectWallet } = useWallet()

	useEffect(() => {
		console.log(account)
		if (account !== null) router.push("/")
		return
	}, [account, router])



	if (!account?.length)
		return (
			<div className={'flex flex-col items-center justify-center space-y-6'}>
				<div className='mb-4'>
					<Image alt='Imagen Logo' width={340} height={66} src={"/img/logo_login.png"} />
				</div>
				<button className='input__button' onClick={connectWallet}>Connect to Metamask</button>
			</div>
		)
}
