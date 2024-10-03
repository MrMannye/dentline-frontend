import React from 'react'
import Head from 'next/head'
import Login from '@/src/modules/auth/components/Login'


export default function login() {
	return (
		<div className='h-full w-full flex flex-1 items-center justify-center bg-login-pattern'>
			<Head>
				<title>DentLine - Sign In</title>
				<meta name="description" content="Sign in into DentLine Page" />
			</Head>
			<Login />
		</div>
	)
}
