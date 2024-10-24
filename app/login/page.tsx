import React from 'react'
import Head from 'next/head'
import Login from '@/src/modules/auth/components/Login'


export default function login() {
	return (
		<div className='h-screen w-full bg-login-pattern'>
			<Head>
				<title>DentLine - Sign In</title>
				<meta name="description" content="Sign in into DentLine Page" />
			</Head>
			<Login />
		</div>
	)
}
